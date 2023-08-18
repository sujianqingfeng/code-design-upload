import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="p-2 min-h-40">
      <Outlet></Outlet>
    </div>
  )
}

export default App
