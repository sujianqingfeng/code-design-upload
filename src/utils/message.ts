import type { SendToBackgroundMessage } from '../types'

export const sendToBackgroundMessage = (message: SendToBackgroundMessage) => {
  return chrome.runtime.sendMessage(message)
}
