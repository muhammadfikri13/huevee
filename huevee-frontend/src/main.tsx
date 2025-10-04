import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Home from './pages/Home.tsx' // Placeholder untuk halaman dashboard
import CreatePalette from './components/CreatePalette.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App sebagai layout
    children: [
      { path: 'login', element: <Login /> },
      { path: 'create', element: <CreatePalette /> },
      { path: '', element: <Home /> }, // Placeholder untuk halaman dashboard
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
