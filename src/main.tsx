import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AuthGate } from './components/AuthGate'
import { SignedInApp } from './components/SignedInApp'
import { AuthProvider } from './context/AuthProvider'
import { createRepositories } from './data'
import './index.css'

// Swap point: createRepositories() decides which data sources the app uses.
const repositories = createRepositories()

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element')

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider auth={repositories.auth}>
        <AuthGate>
          <SignedInApp repositories={repositories} />
        </AuthGate>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
