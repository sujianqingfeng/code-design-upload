import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import manifest from './manifest.json'
import uno from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uno(),
    react(),
    crx({
      manifest,
      contentScripts: {
        preambleCode: false
      }
    })
  ]
})
