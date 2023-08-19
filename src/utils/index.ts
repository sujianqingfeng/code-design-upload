/* eslint-disable @typescript-eslint/no-explicit-any */
import debug from 'debug'
import { EXTENSION_NAME } from '../constants'
const isFunction = (fn: any) => typeof fn === 'function'

/**
 * 包裹 promise 函数，返回一个安全的 promise
 *
 * @param promiseFn
 * @returns
 */
export function createSafePromise<R = unknown, T extends any[] = any[]>(
  promiseFn: (...rest: T) => Promise<R>
) {
  if (!isFunction(promiseFn)) {
    throw new Error('createTryWrapper: promiseFn must be a function')
  }
  return async (
    ...rest: Parameters<typeof promiseFn>
  ): Promise<[true, R] | [false, any]> => {
    try {
      const data = await promiseFn(...rest)
      return [true, data]
    } catch (error) {
      return [false, error]
    }
  }
}

export const readFile = (file: File) => {
  return new Promise<[boolean, string]>((resolve) => {
    const render = new FileReader()
    render.onload = (e) => {
      if (!e.target) {
        resolve([false, '读取文件失败'])
        return
      }
      const result = e.target.result as string
      resolve([true, result])
    }
    render.readAsText(file)
  })
}

export const parseJson = (str: string) => {
  return new Promise<[true, Record<string, any>] | [false, string]>(
    (resolve) => {
      try {
        const data = JSON.parse(str)
        resolve([true, data])
      } catch (error) {
        resolve([false, '解析失败'])
      }
    }
  )
}

export const clearArray = <T>(arr: T[]) => {
  if (arr.length) {
    arr.splice(0, arr.length)
  }
}

export const createDebug = (name: string) => {
  return debug(`${EXTENSION_NAME}: ${name}`)
}

export const appendToFormData = (
  formData: FormData,
  data: Record<string, any>
) => {
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key])
  })
}
