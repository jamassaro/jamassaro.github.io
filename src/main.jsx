import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import i18n from './configs/i18n'
import { I18nextProvider } from 'react-i18next';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
<I18nextProvider i18n={i18n}>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
</I18nextProvider>
 
)
