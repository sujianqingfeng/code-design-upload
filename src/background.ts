import type {
  ExtraFormFn,
  VerifyFn,
  SendToBackgroundCustomUploadMessagePreload,
  SendToBackgroundMessage
} from './types'
import { appendToFormData, createDebug } from './utils'
import {
  getConfigIndexFormStorage,
  getConfigsFormStorage,
  setConfigIndexToStorage,
  setConfigsToStorage
} from './utils/storage'
import { Config } from './utils/template'

const debug = createDebug('background')
debug('-----start background------')

const configs: Config[] = []

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  debug('background receive message', request)

  const message = request as SendToBackgroundMessage
  const { type } = message

  const sendConfigs = () => {
    sendResponse(configs)
  }

  const sendConfigIndex = async () => {
    const index = await getConfigIndexFormStorage()
    sendResponse(index)
  }

  const addConfig = (config: Config) => {
    configs.push(config)
    setConfigsToStorage(configs)
    sendConfigs()
  }

  const getCurrentConfig = async () => {
    const index = await getConfigIndexFormStorage()
    sendResponse(configs[index])
  }

  const customUpload = async (
    data: SendToBackgroundCustomUploadMessagePreload
  ) => {
    const index = await getConfigIndexFormStorage()
    const currentConfig = configs[index]
    if (!currentConfig) {
      return
    }

    const { fileKey, extraForm, action, verify } = currentConfig
    const { url, name } = data

    const blob = await fetch(url).then((res) => res.blob())
    const formData = new FormData()
    formData.append(fileKey, blob)

    const extraFormFn = new Function('name', extraForm) as ExtraFormFn
    appendToFormData(formData, extraFormFn(name))

    const res = await fetch(action, { method: 'POST', body: formData })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const verify = (result: Record<string, any>) => {
    //   console.log('🚀 ~ file: background.ts:58 ~ verify ~ result:', result)
    // }
    // verify(result)
    const verifyFn = new Function('result', verify) as VerifyFn
    const jsonData = await res.json()
    verifyFn(jsonData)
  }

  const deleteCurrentConfig = async () => {
    configs.splice(await getConfigIndexFormStorage(), 1)
    setConfigsToStorage(configs)
    setConfigIndexToStorage(0)
    sendResponse(configs)
  }

  switch (type) {
    case 'addConfig':
      addConfig(message.data)
      break
    case 'getConfigs':
      sendConfigs()
      break
    case 'getConfigIndex':
      sendConfigIndex()
      return true
    case 'setConfigIndex':
      setConfigIndexToStorage(message.data)
      break
    case 'getCurrentConfig':
      getCurrentConfig()
      return true
    case 'customUpload':
      customUpload(message.data)
      // return true
      break

    case 'deleteCurrentConfig':
      deleteCurrentConfig()
      return true
  }
})

const main = async () => {
  const localConfigs = await getConfigsFormStorage()
  configs.push(...localConfigs)
}

main()
