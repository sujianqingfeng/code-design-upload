import type { SendToBackgroundMessage } from './types'
import { appendToFormData, createDebug } from './utils'
import {
  getConfigIndexFormStorage,
  getConfigsFormStorage,
  setConfigIndexToStorage,
  setConfigsToStorage
} from './utils/storage'
import { Config } from './utils/template'

const debug = createDebug('background')
debug('-----start background------')

const configs: Config[] = []

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  debug('background receive message', request)

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

  const getCurrentConfig = async () => {
    const index = await getConfigIndexFormStorage()
    sendResponse(configs[index])
  }

  const customUpload = async (url: string) => {
    const index = await getConfigIndexFormStorage()
    const currentConfig = configs[index]
    if (!currentConfig) {
      return
    }

    const { fileKey, extraForm, action } = currentConfig
    const blob = await fetch(url).then((res) => res.blob())
    const formData = new FormData()
    formData.append(fileKey, blob)
    appendToFormData(formData, extraForm)

    const result = await fetch(action, { method: 'POST', body: formData })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const verify = (result: Record<string, any>) => {
      console.log('🚀 ~ file: background.ts:58 ~ verify ~ result:', result)
    }
    verify(result)
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
    case 'getCurrentConfig':
      getCurrentConfig()
      return true
    case 'customUpload':
      customUpload(message.data)
      // return true
      break
  }
})

const main = async () => {
  const localConfigs = await getConfigsFormStorage()
  configs.push(...localConfigs)
}

main()
