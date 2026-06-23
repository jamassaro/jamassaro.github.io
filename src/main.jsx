import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import i18n from './configs/i18n'
import { I18nextProvider } from 'react-i18next';
import './styles/globals.css'
import './styles/animations.css'

// Set fast animations for dev mode
if (import.meta.env.DEV) {
  document.documentElement.setAttribute('data-dev-mode', 'true');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
)
