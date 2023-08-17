import { Select, message } from 'antd'
import { type ChangeEvent } from 'react'
import { parseJson, readFile } from '../utils'

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
      console.log('🚀 ~ file: Home.tsx:14 ~ onChange ~ parseData:', parseData)
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
