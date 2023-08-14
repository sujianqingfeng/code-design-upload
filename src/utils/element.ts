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
  const {className,text,onClick} = opt
  const el = document.createElement('button')
  el.className = className || ''
  el.innerText = text
  el.onclick = onClick
  return el
}
