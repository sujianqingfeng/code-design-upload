import '../assets/content.css'
import BeforeUploadModal from '../components/BeforeUploadModal'
import { createDebug } from '../utils'
import {
  createUploadRoot,
  getSize,
  intervalElementVisible,
  renderCrxRoot,
  showMessage
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

  const customUpload = async (url: string) => {
    sendToBackgroundMessage({
      type: 'customUpload',
      data: url
    })
  }

  const onUploadClick = (target: Element) => {
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

    const size = getSize(sizeText)
    if (!size) {
      return
    }
    let url = (thumbImgEl as HTMLImageElement).src
    url = url.replace(
      /\/thumbnail\/\d+x\d+/,
      `/thumbnail/${size[0]}x${size[1]}`
    )
    customUpload(url)
  }

  const observer = new IntersectionObserver(
    function (entries) {
      const entry = entries[0]
      const downloadEl = entry.target.querySelector(CODE_DESIGN_DOWNLOAD_CLASS)

      if (!downloadEl) {
        return
      }

      const uploadRoot = createUploadRoot({
        onClick() {
          // showMessage('ffff')
          // onUploadClick(entry.target)

          renderCrxRoot(<BeforeUploadModal />)
        }
      })

      const parentNode = downloadEl.parentNode!
      parentNode.insertBefore(uploadRoot, downloadEl)
    },
    { threshold: [1] }
  )

  intervalElementVisible({
    el: () => document.querySelector('.inspector-nav'),
    timeout: 2000,
    callback(el) {
      observer.observe(el)
    }
  })
})()
