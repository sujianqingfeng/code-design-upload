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
        name: 'test',
        pictureUploadBtText: 'upload',
        action: 'http://test.com',
        verify: 'test'
      }
      const result = Effect.runSync(isTemplateConfigValid(data))
      expect(result).toMatchInlineSnapshot(`
        {
          "action": "http://test.com",
          "extraForm": "()=>({})",
          "fileKey": "file",
          "name": "test",
          "pictureUploadBtText": "upload",
          "verify": "test",
        }
      `)
    })
  })
})
