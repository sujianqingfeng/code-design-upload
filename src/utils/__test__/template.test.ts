import { Effect } from 'effect'
import { describe, test, expect } from 'vitest'
import { isTemplateConfigValid } from '../template'

describe('template', () => {
  describe('isTemplateConfigValid', () => {
    test('error', () => {
      const data = {
        name: 'test'
      }
      expect(() => Effect.runSync(isTemplateConfigValid(data))).toThrowError(
        '配置不合法'
      )
    })

    test('success', () => {
      const data = {
        name: 'name',
        action: 'url',
        verifyIsOk: {
          path: 'code',
          value: 0
        },
        resultMap: {
          urlPath: 'data'
        }
      }
      const result = Effect.runSync(isTemplateConfigValid(data))
      expect(result).toMatchInlineSnapshot(`
        {
          "action": "url",
          "extraForm": {},
          "fileKey": "file",
          "name": "name",
          "pictureUploadBtText": "upload",
          "resultMap": {
            "urlPath": "data",
          },
          "verifyIsOk": {
            "path": "code",
            "value": 0,
          },
        }
      `)
    })
  })
})
