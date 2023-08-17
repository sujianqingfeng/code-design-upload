// eslint-disable-next-line no-extra-semi
;(function (window: Window & typeof globalThis) {
  const XHR = window.XMLHttpRequest.prototype
  const originalSend = XHR.send

  XHR.send = function (
    body: Document | XMLHttpRequestBodyInit | null | undefined
  ) {
    this.addEventListener('load', function () {
      const url = this.responseURL
      if (url.includes('token')) {
        console.log('🚀 ~ file: inject.ts:11 ~ url:', url)
        console.log('🚀 ~ file: inject.ts:21 ~ data:', body)
        if (this.responseType != 'blob' && this.responseText) {
          try {
            const text = this.responseText
            console.log('text', JSON.parse(text))
          } catch (err) {
            console.error('err', err)
          }
        }
      }
    })

    return originalSend.call(this, body)
  }
})(window)
