import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './component/Login.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import Routing from './Routes.jsx'
import './assets/css/style.scss'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  </StrictMode>
)
