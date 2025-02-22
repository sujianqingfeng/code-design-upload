import '../assets/content.css'
import BeforeUploadModal from '../components/BeforeUploadModal'
import { createDebug } from '../utils'
import {
  copyTextToClipboard,
  createCopyRoot,
  createUploadRoot,
  getImageSize,
  hasUploadRoot,
  intervalElementVisible,
  renderCrxRoot
} from '../utils/element'
import { sendToBackgroundMessage } from '../utils/message'
import { type Config } from '../utils/template'

const debug = createDebug('content')

const CODE_DESIGN_THUMB_BOX_CLASS = '.node-box__content .thumb'
const CODE_DESIGN_DOWNLOAD_CLASS = '.download-slices__confirm-button'
const CODE_DESIGN_SLICES_ITEM_CLASS =
  '.download-slices .download-slices__scales-item'
const CODE_DESIGN_SLICE_ITEM_CHECKED_CLASS = '.t-is-checked'
const CODE_DESIGN_SLICE_ITEM_CHECKED_LABEL_CLASS = '.t-checkbox__label small'

;(async function () {
  debug('----start content----')

  const currentConfig = (await sendToBackgroundMessage({
    type: 'getCurrentConfig'
  })) as Config | null

  if (!currentConfig) {
    return
  }
  debug('currentConfig', currentConfig)
  console.log('🚀 ~ currentConfig:', currentConfig)

  const getUrl = (target: Element) => {
    const thumbImgEl = target.querySelector(
      `${CODE_DESIGN_THUMB_BOX_CLASS} img`
    )
    const slicesItemCheckEl = target.querySelector(
      `${CODE_DESIGN_SLICES_ITEM_CLASS} ${CODE_DESIGN_SLICE_ITEM_CHECKED_CLASS}`
    )

    if (!slicesItemCheckEl || !thumbImgEl) {
      return
    }

    const sizeTextEl = slicesItemCheckEl.querySelector(
      `${CODE_DESIGN_SLICE_ITEM_CHECKED_LABEL_CLASS}`
    )
    if (!sizeTextEl) {
      return
    }

    const sizeText = sizeTextEl.textContent
    if (!sizeText) {
      return
    }

    const size = getImageSize(sizeText)
    if (!size) {
      return
    }
    let url = (thumbImgEl as HTMLImageElement).src
    url = url.replace(
      /\/thumbnail\/\d+x\d+/,
      `/thumbnail/${size[0]}x${size[1]}`
    )

    return url
  }

  const onUploadClick = (target: Element) => {
    const url = getUrl(target)
    if (!url) {
      return
    }

    renderCrxRoot(<BeforeUploadModal url={url} />)
  }

  const onCopyClick = (target: Element) => {
    const url = getUrl(target)
    if (!url) {
      return
    }

    copyTextToClipboard(url)

    // Create and show toast notification
    const toast = document.createElement('div')
    toast.textContent = '复制成功'
    toast.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      font-size: 16px;
      z-index: 999999;
      pointer-events: none;
    `

    document.body.appendChild(toast)

    // Remove toast after 2 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 2000)
  }

  const observer = new IntersectionObserver(
    async function (entries) {
      const entry = entries[0]

      if (!entry.intersectionRatio) {
        return
      }

      if (hasUploadRoot(entry.target)) {
        return
      }

      intervalElementVisible({
        el: () => entry.target.querySelector(CODE_DESIGN_DOWNLOAD_CLASS),
        timeout: 1000,
        callback(el) {
          const uploadRoot = createUploadRoot({
            text: currentConfig.pictureUploadBtText,
            onClick() {
              onUploadClick(entry.target)
            }
          })

          const copyRoot = createCopyRoot({
            text: '复制url',
            onClick() {
              onCopyClick(entry.target)
            }
          })

          const parentNode = el.parentNode!
          parentNode.insertBefore(uploadRoot, el)
          parentNode.insertBefore(copyRoot, el)
        }
      })
    },
    { threshold: [1] }
  )

  intervalElementVisible({
    el: () => document.querySelector('.screen-inspector'),
    timeout: 2000,
    callback(el) {
      observer.observe(el)
    }
  })
})()
