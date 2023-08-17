import { Select } from 'antd'

function App() {
  return (
    <>
      <div className="flex-start-center gap-2">
        <Select
          placeholder="请选择配置"
          options={[{ value: 'jack', label: 'Jack' }]}
        />

        <span className="relative" role="button">
          <input id="file" type="file" className="hidden"></input>
          <label htmlFor="file">
            <i className="inline-block i-carbon-document-import"></i>
          </label>
        </span>
      </div>
    </>
  )
}

export default App
