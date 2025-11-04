import '@lynx-js/preact-devtools'
import '@lynx-js/react/debug'
import { root } from '@lynx-js/react'

import { App } from './App.jsx'
import { ThemeProvider } from './context/ThemeProvider'
import { ThemeErrorBoundary } from './components/ErrorBoundary'
import './App.css';

root.render(
  <ThemeErrorBoundary>
    <ThemeProvider defaultMode="system" defaultCustomColor="#3b82f6">
      <App />
    </ThemeProvider>
  </ThemeErrorBoundary>
)

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
