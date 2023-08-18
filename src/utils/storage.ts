import { CONFIGS_KEY, CONFIG_INDEX_KEY } from '../constants'
import { type Config } from './template'

export const getConfigsFormStorage = async (defaultValue = []) => {
  const result = await chrome.storage.local.get(CONFIGS_KEY)
  return result[CONFIGS_KEY] || defaultValue
}

export const setConfigsToStorage = async (configs: Config[]) => {
  await chrome.storage.local.set({
    [CONFIGS_KEY]: configs
  })
}

export const getConfigIndexFormStorage = async (defaultValue = 0) => {
  const result = await chrome.storage.local.get(CONFIG_INDEX_KEY)
  return result[CONFIG_INDEX_KEY] || defaultValue
}

export const setConfigIndexToStorage = async (index: number) => {
  await chrome.storage.local.set({
    [CONFIG_INDEX_KEY]: index
  })
}
