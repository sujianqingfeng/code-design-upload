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

export type SendToBackgroundCustomUploadMessagePreload = {
  url: string
  name: string
  suffix: string
}

type SendToBackgroundCustomUploadMessage = {
  type: 'customUpload'
  data: SendToBackgroundCustomUploadMessagePreload
}

export type SendToBackgroundCustomUploadMessageResponse =
  | {
      isOk: false
      message: string
    }
  | { isOk: true; url: string }

type SendToBackgroundDeleteCurrentConfigMessage = {
  type: 'deleteCurrentConfig'
}

type SendToGetHistoriesMessage = {
  type: 'getHistories'
}

export type SendToBackgroundMessage =
  | SendToBackgroundAddConfigMessage
  | SendToBackgroundGetConfigsMessage
  | SendToBackgroundGetConfigIndexMessage
  | SendToBackgroundSetConfigIndexMessage
  | SendToBackgroundGetCurrentConfigMessage
  | SendToBackgroundCustomUploadMessage
  | SendToBackgroundDeleteCurrentConfigMessage
  | SendToGetHistoriesMessage

type SendToPopupGetConfigsMessage = {
  type: 'getConfigs'
  data: Config[]
}

export type SendToPopupMessage = SendToPopupGetConfigsMessage
