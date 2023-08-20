import { z } from 'zod'

const zConfig = z.object({
  name: z.string(),
  pictureUploadBtText: z.string().optional().default('upload'),
  action: z.string(),
  fileKey: z.string().optional().default('file'),
  extraForm: z.string().optional().default('()=>({})'),
  verify: z.string()
})

export type Config = z.infer<typeof zConfig>

export const isTemplateConfigValid = (
  data: Record<string, string>
): [true, Config] | [false, string] => {
  const result = zConfig.safeParse(data)
  return result.success ? [true, result.data] : [false, '配置不合法']
}
