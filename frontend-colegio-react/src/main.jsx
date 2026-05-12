import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'  <-- Esta es la que causaba el problema
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)