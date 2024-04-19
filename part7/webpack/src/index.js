import App from './App'
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'core-js/stable/index.js'
import 'regenerator-runtime/runtime.js'
import './index.css'


const hello = name => {
  console.log(`hello ${name}`)
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)