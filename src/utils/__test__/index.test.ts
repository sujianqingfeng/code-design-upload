import { get, getImageInfoFromUrl, parseJson, readFile } from '../index'
import { Effect } from 'effect'
import { describe, test, expect } from 'vitest'

describe('utils index', () => {
  test('getImageInfoFromUrl', () => {
    const url =
      'https://cdn3.codesign.qq.com/a6a68207-a7c1-4f06-8382-5236a937db43.png?imageMogr2/thumbnail/732x964/interlace/1'
    const result = getImageInfoFromUrl(url)
    expect(result).toMatchInlineSnapshot(`
      {
        "name": "a6a68207-a7c1-4f06-8382-5236a937db43",
        "suffix": "png",
      }
    `)
  })

  test('readFile', async () => {
    const str = `{"name": "test config"}`
    const f = new File([str], 'test.txt', { type: 'text/plain' })
    const result = await Effect.runPromise(readFile(f))
    expect(result).toMatchInlineSnapshot('"{\\"name\\": \\"test config\\"}"')
  })

  test('parseJson', async () => {
    const str = `{"name": "test config"}`
    const result = await Effect.runPromise(parseJson(str))
    expect(result).toMatchInlineSnapshot(`
      {
        "name": "test config",
      }
    `)
  })

  test('get', () => {
    const data = {
      code: 0,
      data: 'test'
    }
    const result = get(data, 'data')
    expect(result).toBe('test')
  })
})
