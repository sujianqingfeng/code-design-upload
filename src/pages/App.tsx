import {Select} from 'antd'

function App() {
  return <>
   <div className=''>
   <Select
      options={[
        { value: 'jack', label: 'Jack' },
      ]}
    />
    <button className='i-carbon-document-import h-4 w-4'></button>
   </div>
  
  </>
}

export default App
