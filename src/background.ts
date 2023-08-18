import { CONFIGS_KEY } from './constants'
import type { SendBackgroundMessage } from './types'
import { Config } from './utils/template'

console.log('-------background---------')
const configs: Config[] = []

const getConfigs = async () => {
  const result = await chrome.storage.local.get(CONFIGS_KEY)
  const localConfigs = result[CONFIGS_KEY] || []
  configs.push(...localConfigs)
  console.log('🚀 ~ file: background.ts:8 ~ getConfigs ~ result:', localConfigs)
}

const addConfig = async (config: Config) => {
  console.log('-----addConfig')
  await chrome.storage.local.set({
    [CONFIGS_KEY]: [config]
  })
  getConfigs()
}

chrome.runtime.onMessage.addListener((request) => {
  console.log('receive message', request)

  const message = request as SendBackgroundMessage
  const { type } = message

  switch (type) {
    case 'addConfig':
      addConfig(message.data)
      break
  }
})

const main = () => {
  getConfigs()
}

main()
