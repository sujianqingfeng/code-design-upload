import { message } from 'antd'

const HistoryItem = () => {
  const [messageApi, contextHolder] = message.useMessage()

  const onCopy = () => {
    messageApi.success('复制成功')
  }

  return (
    <>
      <div className="flex-between-center">
        <div className="flex-start-center gap-2">
          <img className="h-10" src="https://picsum.photos/200/300" />
          <span>name</span>
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
