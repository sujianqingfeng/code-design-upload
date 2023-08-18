import { Config } from './utils/template'

type SendBackgroundAddConfigMessage = {
  type: 'addConfig'
  data: Config
}

export type SendBackgroundMessage = SendBackgroundAddConfigMessage
