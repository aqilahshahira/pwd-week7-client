import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')
if (!root) throw new Error('Could not find a root element to display the app.')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
