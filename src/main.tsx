import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './lib/theme'
import { LanguageProvider } from './lib/language'
import { TermsProvider } from './lib/terms'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <TermsProvider>
          <App />
        </TermsProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
