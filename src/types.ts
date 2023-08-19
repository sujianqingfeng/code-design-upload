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

type SendToBackgroundGetCurrentConfigMessage = {
  type: 'getCurrentConfig'
}

type SendToBackgroundCustomUploadMessage = {
  type: 'customUpload'
  data: string
}

type SendToBackgroundDeleteCurrentConfigMessage = {
  type: 'deleteCurrentConfig'
}

export type SendToBackgroundMessage =
  | SendToBackgroundAddConfigMessage
  | SendToBackgroundGetConfigsMessage
  | SendToBackgroundGetConfigIndexMessage
  | SendToBackgroundSetConfigIndexMessage
  | SendToBackgroundGetCurrentConfigMessage
  | SendToBackgroundCustomUploadMessage
  | SendToBackgroundDeleteCurrentConfigMessage

type SendToPopupGetConfigsMessage = {
  type: 'getConfigs'
  data: Config[]
}

export type SendToPopupMessage = SendToPopupGetConfigsMessage
