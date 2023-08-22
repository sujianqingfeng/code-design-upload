import { HistoryItemProps } from './components/HistoryItem'
import type {
  SendToBackgroundCustomUploadMessagePreload,
  SendToBackgroundMessage
} from './types'
import { appendToFormData, createDebug, get } from './utils'
import {
  getConfigIndexFormStorage,
  getConfigsFormStorage,
  getHistoriesFormStorage,
  setConfigIndexToStorage,
  setConfigsToStorage,
  setHistoriesToStorage
} from './utils/storage'
import { type Config } from './utils/template'

const debug = createDebug('background')
debug('-----start background------')

const configs: Config[] = []
const histories: HistoryItemProps[] = []

const receiveMessage = () => {
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

    const addHistory = (history: HistoryItemProps) => {
      histories.push(history)
      if (histories.length > 5) {
        histories.shift()
      }
      setHistoriesToStorage(histories)
    }

    const sendHistories = () => {
      sendResponse(histories)
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
      debug('fetch result', jsonData)

      const { path: verifyPath, value: verifyValue } = verifyIsOk

      const valid = get(jsonData, verifyPath)
      debug('verify value', valid)

      const isOk = valid === verifyValue
      debug('verify result', isOk)

      if (!isOk) {
        sendResponse({ isOk, message: '上传失败' })
        return
      }
      const { urlPath } = resultMap
      const resultUrl = get(jsonData, urlPath)
      addHistory({ name: fileName, url: resultUrl })
      sendResponse({ isOk, url: resultUrl })
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
        return true

      case 'deleteCurrentConfig':
        deleteCurrentConfig()
        return true

      case 'getHistories':
        sendHistories()
        return true
    }
  })
}

const main = async () => {
  const localConfigs = await getConfigsFormStorage()
  configs.push(...localConfigs)
  const localHistories = await getHistoriesFormStorage()
  histories.push(...localHistories)
  receiveMessage()
}

main()
