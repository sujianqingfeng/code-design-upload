import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="p-2 min-h-80 min-w-70">
      <Outlet></Outlet>
    </div>
  )
}

export default App
