import { Select, message } from 'antd'
import { type ChangeEvent } from 'react'
import { parseJson, readFile } from '../utils'
import { isTemplateConfigValid } from '../utils/template'
import { SendBackgroundMessage } from '../types'

function Home() {
  const [messageApi, contextHolder] = message.useMessage()

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0]
      const [isReadFileOk, readFileData] = await readFile(file)
      if (!isReadFileOk) {
        messageApi.error(readFileData)
        return
      }
      const [isParseOk, parseData] = await parseJson(readFileData)
      if (!isParseOk) {
        messageApi.error(parseData)
        return
      }
      const isValid = isTemplateConfigValid(parseData)
      if (!isValid) {
        messageApi.error('配置文件不合法')
        return
      }
      console.log('---send-----')

      chrome.runtime.sendMessage<SendBackgroundMessage>({
        type: 'addConfig',
        data: parseData
      })
    }
  }

  return (
    <>
      <div className="flex-start-center gap-2">
        <Select
          placeholder="请选择配置"
          options={[{ value: 'jack', label: 'Jack' }]}
        />

        <span className="relative" role="button">
          <input
            onChange={onChange}
            id="file"
            type="file"
            className="hidden"
          ></input>
          <label htmlFor="file">
            <i className="inline-block i-carbon-document-import"></i>
          </label>
        </span>
      </div>

      {contextHolder}
    </>
  )
}

export default Home
