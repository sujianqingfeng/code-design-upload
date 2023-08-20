import { z } from 'zod'
import { Effect } from 'effect'

const zConfig = z.object({
  name: z.string().min(1).max(20).trim(),
  pictureUploadBtText: z.string().optional().default('upload'),
  action: z.string().min(1).trim(),
  fileKey: z.string().optional().default('file'),
  extraForm: z.string().optional().default('()=>({})'),
  verify: z.string().min(1).trim()
})

export type Config = z.infer<typeof zConfig>

// export const isTemplateConfigValid = (
//   data: Record<string, string>
// ): [true, Config] | [false, string] => {
//   const result = zConfig.safeParse(data)
//   return result.success ? [true, result.data] : [false, '配置不合法']
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTemplateConfigValid = (data: Record<string, any>) => {
  return Effect.try({
    try: () => zConfig.parse(data),
    catch: () => Effect.fail('配置不合法')
  })
}
