import { message } from 'antd'
import { copyTextToClipboard } from '../utils/element'

export type HistoryItemProps = {
  name: string
  url: string
}
const HistoryItem = (props: HistoryItemProps) => {
  const [messageApi, contextHolder] = message.useMessage()

  const { name, url } = props

  const onCopy = () => {
    copyTextToClipboard(url)
    messageApi.success('复制成功')
  }

  return (
    <>
      <div className="flex-between-center mt-2">
        <div className="flex-start-center gap-2">
          <img className="h-10" src={url} />
          <span>{name}</span>
        </div>

        <div>
          <button
            onClick={onCopy}
            className="i-carbon-copy size-1 cursor-pointer"
          ></button>
        </div>
      </div>

      {contextHolder}
    </>
  )
}

export default HistoryItem
