import { StrictMode } from 'react'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Routing from './Routes.jsx'
import './assets/css/style.scss'
import { BrowserRouter } from 'react-router-dom';

function App() {

  return (
    <StrictMode>
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  </StrictMode>
  )
}

export default App
