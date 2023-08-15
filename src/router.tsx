import {createMemoryRouter} from 'react-router-dom'
import App from './pages/App'


const router = createMemoryRouter([
  {
    path:'/',
    element: <App/>
  }
])



export default router