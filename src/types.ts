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
}

type SendToBackgroundCustomUploadMessage = {
  type: 'customUpload'
  data: SendToBackgroundCustomUploadMessagePreload
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

export type ExtraFormFn = (name: string) => Record<string, unknown>

export type VerifyData = {
  copyUrl: string
  url: string
  name: string
}
export type VerifyFn = (
  data: Record<string, unknown>
) => ({ isVerify: true } & VerifyData) | { isVerify: false }
