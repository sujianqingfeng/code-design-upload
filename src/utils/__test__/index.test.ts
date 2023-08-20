import { getImageInfoFromUrl } from '../index'

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
})
