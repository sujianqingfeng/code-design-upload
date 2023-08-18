import { Config } from './utils/template'

export type SendToBackgroundAddConfigMessage = {
  type: 'addConfig'
  data: Config
}

export type SendToBackgroundGetConfigsMessage = {
  type: 'getConfigs'
}

export type SendToBackgroundGetConfigIndexMessage = {
  type: 'getConfigIndex'
}

type SendToBackgroundSetConfigIndexMessage = {
  type: 'setConfigIndex'
  data: number
}

export type SendToBackgroundMessage =
  | SendToBackgroundAddConfigMessage
  | SendToBackgroundGetConfigsMessage
  | SendToBackgroundGetConfigIndexMessage
  | SendToBackgroundSetConfigIndexMessage

type SendToPopupGetConfigsMessage = {
  type: 'getConfigs'
  data: Config[]
}

export type SendToPopupMessage = SendToPopupGetConfigsMessage
