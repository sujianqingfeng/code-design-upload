import type {
  SendToBackgroundCustomUploadMessagePreload,
  SendToBackgroundMessage
} from './types'
import { appendToFormData, createDebug, get } from './utils'
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

  const customUpload = async (
    data: SendToBackgroundCustomUploadMessagePreload
  ) => {
    const index = await getConfigIndexFormStorage()
    const currentConfig = configs[index]
    if (!currentConfig) {
      return
    }

    const { fileKey, extraForm, action, formMapName, verifyIsOk, resultMap } =
      currentConfig
    const { url, name, suffix } = data

    const fileName = `${name}.${suffix}`
    const blob = await fetch(url).then((res) => res.blob())
    const formData = new FormData()
    formData.append(fileKey, blob, fileName)

    appendToFormData(formData, extraForm)

    if (formMapName) {
      formData.append(formMapName, fileName)
    }

    const res = await fetch(action, { method: 'POST', body: formData })

    const jsonData = await res.json()
    const { path: verifyPath, value: verifyValue } = verifyIsOk
    const isOk = get(jsonData, verifyPath) === verifyValue

    if (!isOk) {
      return
    }
    const { urlPath } = resultMap
    const resultUrl = get(jsonData, urlPath)
    console.log(
      '🚀 ~ file: background.ts:80 ~ chrome.runtime.onMessage.addListener ~ resultUrl:',
      resultUrl
    )
  }

  const deleteCurrentConfig = async () => {
    configs.splice(await getConfigIndexFormStorage(), 1)
    setConfigsToStorage(configs)
    setConfigIndexToStorage(0)
    sendResponse(configs)
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

    case 'deleteCurrentConfig':
      deleteCurrentConfig()
      return true
  }
})

const main = async () => {
  const localConfigs = await getConfigsFormStorage()
  configs.push(...localConfigs)
}

main()
