import { defineConfig, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  rules: [
    [
      /^size-(.+)$/,
      ([, size]) => ({
        height: `${size}rem`,
        width: `${size}rem`
      })
    ]
  ],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-start-center': 'flex items-center justify-start',
    'flex-between-center': 'flex items-center justify-between',
    'flex-between-start': 'flex items-start justify-between'
  }
})
