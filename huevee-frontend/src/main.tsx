import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Home from './pages/Home.tsx' // Placeholder untuk halaman dashboard
import CreatePalette from './components/CreatePalette.tsx'
import Dashboard from './pages/Dashboard.tsx'
import EditPalette from './pages/EditPalette.tsx'
import ManageUsers from './pages/ManageUsers.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App sebagai layout
    children: [
      { path: 'login', element: <Login /> },
      { path: 'create', element: <CreatePalette /> },
      { path: '', element: <Home /> }, // Placeholder untuk halaman dashboard
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'edit/:id', element: <EditPalette /> },
      { path: 'manage-users', element: <ManageUsers /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
