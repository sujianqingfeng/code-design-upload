import { createMemoryRouter } from 'react-router-dom'
import App from './pages/App'
import Home from './pages/Home'

const router = createMemoryRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      }
    ]
  }
])

export default router
