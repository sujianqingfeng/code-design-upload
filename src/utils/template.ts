import { z } from 'zod'

const config = z.object({
  name: z.string(),
  uploadText: z.string().optional().default('upload')
})

export type Config = z.infer<typeof config>

export const isTemplateConfigValid = (
  data: Record<string, string>
): data is Config => {
  return config.safeParse(data).success
}
