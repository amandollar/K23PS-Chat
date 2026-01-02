import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode> // Modify StrictMode if double renders cause issues with socket
    <App />
  // </React.StrictMode>,
)
