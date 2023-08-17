import injectSrc from './inject?script&module'
;(function () {
  console.log('-----inject-content-start-----')
  const url = chrome.runtime.getURL(injectSrc)

  const scriptEl = document.createElement('script')
  scriptEl.src = url

  const wrapper = document.head || document.documentElement
  wrapper.append(scriptEl)
})()
