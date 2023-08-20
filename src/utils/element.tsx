import React from 'react'
import ReactDOM from 'react-dom/client'
import { CONTENT_CRX_ROOT_ID, MESSAGE_BOX_CLASS_NAME } from '../constants'

type Option = {
  el: () => Element | null
  timeout: number
  callback: (el: Element) => void
}

export const intervalElementVisible = (opt: Option) => {
  const { timeout, el: getEl, callback } = opt

  const timer = setInterval(() => {
    const el = getEl()
    if (el) {
      callback(el)
      clearInterval(timer)
    }
  }, timeout)
}

type DivOption = {
  id?: string
  className?: string
  child: Node
}

export const createDivElement = (opt: DivOption) => {
  const { className, child } = opt
  const el = document.createElement('div')
  el.className = className || ''
  el.appendChild(child)
  return el
}

type BtOption = {
  className?: string
  text: string
  onClick: () => void
}
export const createBtElement = (opt: BtOption) => {
  const { className, text, onClick } = opt
  const el = document.createElement('button')
  el.className = className || ''
  el.innerText = text
  el.onclick = onClick
  return el
}

export const getImageSize = (str: string) => {
  const pattern = /(\d+)px x (\d+)px/
  const result = pattern.exec(str)

  if (result && result.length > 2) {
    return [result[1], result[2]]
  }
  return null
}

export const createUploadRoot = (opt: Pick<BtOption, 'onClick'>) => {
  const { onClick } = opt

  const uploadBtEl = createBtElement({
    className: 'upload-bt',
    text: 'upload',
    onClick
  })
  const uploadRoot = createDivElement({
    id: 'upload-root',
    className: 'upload-root',
    child: uploadBtEl
  })

  return uploadRoot
}

export const showMessage = (msg: string) => {
  const el = document.createElement('div')
  el.innerText = msg
  el.classList.add(MESSAGE_BOX_CLASS_NAME)
  document.body.appendChild(el)
  setTimeout(() => {
    el.style.top = '20px'
  }, 0)
  setTimeout(() => {
    document.body.removeChild(el)
  }, 2000)
}

export const renderCrxRoot = (el: JSX.Element) => {
  const root = document.createElement('div')
  root.id = CONTENT_CRX_ROOT_ID
  document.body.appendChild(root)

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <>{el}</>
    </React.StrictMode>
  )
}

export const copyTextToClipboard = (text: string) => {
  const copyFrom = document.createElement('textarea')
  copyFrom.textContent = text
  document.body.appendChild(copyFrom)
  copyFrom.select()
  document.execCommand('copy')
  copyFrom.blur()
  document.body.removeChild(copyFrom)
}
