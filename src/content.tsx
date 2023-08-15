// https://cdn3.codesign.qq.com/screen-slices/2023/07/04/2kY5j233AlD6070ExNd04/vlc3idauyiufvgne/608975f3-4b32-43cb-858d-87badcc87eb5.png?imageMogr2/thumbnail/160x160/interlace/1

import './assets/content.css'
import {
  createBtElement,
  createDivElement,
  getSize,
  intervalElementVisible
} from './utils/element'

const CODE_DESIGN_THUMB_BOX_CLASS = '.node-box__content .thumb'
const CODE_DESIGN_DOWNLOAD_CLASS = '.download-slices__confirm-button'
const CODE_DESIGN_SLICES_ITEM_CLASS =
  '.download-slices .download-slices__scales-item'
const CODE_DESIGN_SLICE_ITEM_CHECKED_CLASS = '.t-is-checked'
const CODE_DESIGN_SLICE_ITEM_CHECKED_LABEL_CLASS = '.t-checkbox__label small'

;(function () {
  console.log('----content----')


  const customUpload = async (url: string)=>{
    const blob = await fetch(url).then(res=>res.blob())
    const formData = new FormData()
    formData.append('file', blob)
    console.log("🚀 ~ file: content.tsx:26 ~ customUpload ~ formData:", formData)
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
    url = url.replace(/\/thumbnail\/\d+x\d+/, `/thumbnail/${size[0]}x${size[1]}`)
    customUpload(url)
  }

  const observer = new IntersectionObserver(
    function (entries) {
      const entry = entries[0]
      const downloadEl = entry.target.querySelector(CODE_DESIGN_DOWNLOAD_CLASS)

      if (!downloadEl) {
        return
      }

      const parentNode = downloadEl.parentNode!

      const uploadBtEl = createBtElement({
        className: 'upload-bt',
        text: 'upload',
        onClick() {
          onUploadClick(entry.target)
        }
      })
      const uploadRoot = createDivElement({
        id: 'upload-root',
        className: 'upload-root',
        child: uploadBtEl
      })

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
