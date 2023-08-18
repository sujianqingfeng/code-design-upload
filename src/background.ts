import type { SendToBackgroundMessage } from './types'
import {
  getConfigIndexFormStorage,
  getConfigsFormStorage,
  setConfigIndexToStorage,
  setConfigsToStorage
} from './utils/storage'
import { Config } from './utils/template'

console.log('-------background---------')

const configs: Config[] = []

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  console.log('background receive message', request)

  const message = request as SendToBackgroundMessage
  const { type } = message

  const sendConfigs = () => {
    sendResponse(configs)
  }

  const sendConfigIndex = async () => {
    const index = await getConfigIndexFormStorage()
    sendResponse(index)
  }

  const addConfig = (config: Config) => {
    configs.push(config)
    setConfigsToStorage(configs)
    sendConfigs()
  }

  switch (type) {
    case 'addConfig':
      addConfig(message.data)
      break
    case 'getConfigs':
      sendConfigs()
      break
    case 'getConfigIndex':
      sendConfigIndex()
      return true
    case 'setConfigIndex':
      setConfigIndexToStorage(message.data)
      break
  }
})

const main = async () => {
  const localConfigs = await getConfigsFormStorage()
  configs.push(...localConfigs)
}

main()
