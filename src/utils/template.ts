import { z } from 'zod'
import { Effect } from 'effect'

const zConfig = z.object({
  name: z.string().min(1).max(20).trim(),
  pictureUploadBtText: z.string().optional().default('upload'),
  action: z.string().min(1).trim(),
  fileKey: z.string().optional().default('file'),
  extraForm: z.record(z.any()).default({}),
  formMapName: z.string().optional(),
  verifyIsOk: z.object({
    path: z.string(),
    value: z.any()
  }),
  resultMap: z.object({
    urlPath: z.string()
  })
})

export type Config = z.infer<typeof zConfig>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTemplateConfigValid = (data: Record<string, any>) => {
  return Effect.try({
    try: () => zConfig.parse(data),
    catch: () => Effect.fail('配置不合法')
  })
}
