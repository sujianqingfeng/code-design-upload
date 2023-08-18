import { Select, message, type SelectProps } from 'antd'
import { useState, useEffect, type ChangeEvent } from 'react'
import { parseJson, readFile } from '../utils'
import { Config, isTemplateConfigValid } from '../utils/template'
import { type SendToBackgroundMessage } from '../types'

const createConfigOptions = (configs: Config[]): SelectProps['options'] => {
  return configs.map((config, index) => {
    return {
      value: index,
      label: config.name
    }
  })
}

const sendToBackgroundMessage = (message: SendToBackgroundMessage) => {
  return chrome.runtime.sendMessage(message)
}

function Home() {
  const [messageApi, contextHolder] = message.useMessage()
  const [options, setOptions] = useState<SelectProps['options']>([])
  const [configIndex, setConfigIndex] = useState(-1)

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
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
      const [isValid, config] = isTemplateConfigValid(parseData)
      if (!isValid) {
        messageApi.error(config)
        return
      }

      messageApi.success('配置文件导入成功')
      const configs = await sendToBackgroundMessage({
        type: 'addConfig',
        data: config
      })
      const options = createConfigOptions(configs)
      setOptions(options)
    }
  }

  const onConfigChange = async (value: number) => {
    setConfigIndex(value)
    sendToBackgroundMessage({ type: 'setConfigIndex', data: value })
  }

  useEffect(() => {
    const getConfigs = async () => {
      const configs = await sendToBackgroundMessage({
        type: 'getConfigs'
      })
      const options = createConfigOptions(configs)
      setOptions(options)
    }
    getConfigs()
  }, [])

  useEffect(() => {
    const getConfigIndex = async () => {
      const index = await sendToBackgroundMessage({
        type: 'getConfigIndex'
      })
      setConfigIndex(index)
    }
    getConfigIndex()
  }, [])

  return (
    <>
      <div className="flex-start-center gap-2">
        <Select
          value={configIndex}
          placeholder="请选择配置"
          options={options}
          onChange={onConfigChange}
        />

        <span className="relative" role="button">
          <input
            onChange={onFileChange}
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
