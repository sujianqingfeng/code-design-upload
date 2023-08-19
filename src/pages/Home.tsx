import { Select, message, Modal, type SelectProps } from 'antd'
import { useState, useEffect, type ChangeEvent } from 'react'
import { parseJson, readFile } from '../utils'
import { Config, isTemplateConfigValid } from '../utils/template'
import { sendToBackgroundMessage } from '../utils/message'
import HistoryItem from '../components/HistoryItem'

const createConfigOptions = (configs: Config[]): SelectProps['options'] => {
  return configs.map((config, index) => {
    return {
      value: index,
      label: config.name
    }
  })
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

  const onDeleteConfig = async () => {
    Modal.warning({
      content: '确定删除该配置吗？',
      onOk: async () => {
        const configs = await sendToBackgroundMessage({
          type: 'deleteCurrentConfig'
        })
        const options = createConfigOptions(configs)
        setOptions(options)
        setConfigIndex(0)
        messageApi.success('配置删除成功')
      }
    })
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

        <span className="flex-start-center">
          <input
            onChange={onFileChange}
            id="file"
            type="file"
            className="hidden"
          ></input>
          <label htmlFor="file" className="flex-start-center">
            <i className="i-carbon-document-import size-1 cursor-pointer"></i>
          </label>
        </span>

        {configIndex !== -1 && (
          <i
            onClick={onDeleteConfig}
            className="i-carbon-trash-can size-1 cursor-pointer"
          ></i>
        )}
      </div>

      <div className="mt-2">
        <HistoryItem />
      </div>

      {contextHolder}
    </>
  )
}

export default Home
