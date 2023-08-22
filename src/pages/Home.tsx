import { Select, message, Modal, type SelectProps } from 'antd'
import { useState, useEffect, type ChangeEvent } from 'react'
import { parseJson, readFile } from '../utils'
import { type Config, isTemplateConfigValid } from '../utils/template'
import { sendToBackgroundMessage } from '../utils/message'
import HistoryItem, { type HistoryItemProps } from '../components/HistoryItem'
import { Effect, pipe } from 'effect'

type Options = Exclude<SelectProps['options'], undefined>

const createConfigOptions = (configs: Config[]): Options => {
  return configs.map((config, index) => {
    return {
      value: index,
      label: config.name
    }
  })
}

function Home() {
  const [messageApi, contextHolder] = message.useMessage()
  const [options, setOptions] = useState<Options>([])
  const [configIndex, setConfigIndex] = useState<null | number>(null)
  const [histories, setHistories] = useState<HistoryItemProps[]>([])

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0]

      const onfulfilled = async (config: Config) => {
        messageApi.success('配置文件导入成功')
        const configs = await sendToBackgroundMessage({
          type: 'addConfig',
          data: config
        })
        const options = createConfigOptions(configs)
        setOptions(options)
      }

      Effect.runPromise(
        pipe(
          file,
          readFile,
          Effect.flatMap(parseJson),
          Effect.flatMap(isTemplateConfigValid)
        )
      )
        .then(onfulfilled)
        .catch((error) => {
          messageApi.error(error.message)
        })
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
      if (options.length) {
        setConfigIndex(index)
      }
    }
    getConfigIndex()
  }, [options])

  useEffect(() => {
    const getHistories = async () => {
      const histories = await sendToBackgroundMessage({
        type: 'getHistories'
      })
      setHistories(histories)
    }
    getHistories()
  }, [])

  const existHistory = () => {
    return (
      <>
        <p>历史</p>
        {histories.map((item) => {
          return <HistoryItem {...item} />
        })}
      </>
    )
  }

  return (
    <>
      <div className="flex-start-center gap-2">
        <Select
          className="flex-1"
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
        {histories.length ? (
          existHistory()
        ) : (
          <div className="h-20 flex-center">
            <p className="color-gray">暂无历史数据</p>
          </div>
        )}
      </div>

      {contextHolder}
    </>
  )
}

export default Home
