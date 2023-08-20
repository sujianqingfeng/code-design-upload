import { Modal, Input, message } from 'antd'
import { useState, type ChangeEvent } from 'react'
import { sendToBackgroundMessage } from '../utils/message'
import { getImageInfoFromUrl } from '../utils'
import { copyTextToClipboard } from '../utils/element'

type Props = {
  url: string
}

const BeforeUploadModal = (props: Props) => {
  const { url } = props
  const [messageApi, contextHolder] = message.useMessage()

  const result = getImageInfoFromUrl(url)
  const [open, setOpen] = useState(true)
  const [name, setName] = useState(result?.name || '')

  const onCancel = () => {
    setOpen(false)
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const onOk = () => {
    messageApi.success('上传成功，已复制')
    copyTextToClipboard('上传成功，已复制')
    sendToBackgroundMessage({
      type: 'customUpload',
      data: {
        url,
        name
      }
    })
  }

  return (
    <>
      <Modal
        title="预览"
        closeIcon={null}
        open={open}
        onCancel={onCancel}
        onOk={onOk}
        okText="确定"
        cancelText="取消"
      >
        <Input
          placeholder="请输入名字"
          value={name}
          onChange={onInputChange}
          addonAfter={'.' + result?.suffix}
        />

        <img src={url} style={{ marginTop: '0.5rem', maxWidth: '100%' }} />
      </Modal>

      {contextHolder}
    </>
  )
}

export default BeforeUploadModal
