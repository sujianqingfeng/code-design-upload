// https://cdn3.codesign.qq.com/screen-slices/2023/07/04/2kY5j233AlD6070ExNd04/vlc3idauyiufvgne/608975f3-4b32-43cb-858d-87badcc87eb5.png?imageMogr2/thumbnail/160x160/interlace/1

import './assets/content.css';
import {
  createBtElement,
  createDivElement,
  intervalElementVisible
} from './utils/element';

(function () {
  console.log('----content----')

  const observer = new IntersectionObserver(
    function (entries) {
      const entry = entries[0]
      const downloadEl = entry.target.querySelector(
        '.download-slices__confirm-button'
      )

      if (!downloadEl) {
        return
      }
      console.log('🚀 ~ file: content.tsx:23 ~ downloadEl:', downloadEl)

      const parentNode = downloadEl.parentNode!

      const uploadBtEl = createBtElement({
        className: 'upload-bt',
        text: 'upload',
        onClick() {}
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
