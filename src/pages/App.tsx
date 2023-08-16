import { Select } from 'antd'

function App() {
  const onImport = () => {}

  return (
    <>
      <div className="flex-start-center">
        <Select options={[{ value: 'jack', label: 'Jack' }]} />
        <button
          onClick={onImport}
          className="i-carbon-document-import size-4"
        ></button>
      </div>
    </>
  )
}

export default App
