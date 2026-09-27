import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/geist-sans';
import './assets/styles/globals.css'
import App from './app/App.jsx'
// Must load after the app styles: the former CDN build injected its stylesheet last.
import './assets/styles/tailwind.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
