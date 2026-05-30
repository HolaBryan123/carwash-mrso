import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Ingresos from './pages/Ingresos'
import Servicios from './pages/Servicios'
import Reportes from './pages/Reportes'
import Usuarios from './pages/Usuarios'

const Layout = ({ children }) => (
  <div className='flex min-h-screen bg-gray-100 dark:bg-zinc-950 transition-colors duration-300'>
    <Sidebar />
    <main className='flex-1 ml-64 p-0'>
      {children}
    </main>
  </div>
)

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path='/ingresos' element={
              <ProtectedRoute>
                <Layout><Ingresos /></Layout>
              </ProtectedRoute>
            } />
            <Route path='/servicios' element={
              <ProtectedRoute roles={['PROPIETARIO', 'ADMINISTRADOR']}>
                <Layout><Servicios /></Layout>
              </ProtectedRoute>
            } />
            <Route path='/reportes' element={
              <ProtectedRoute roles={['PROPIETARIO', 'ADMINISTRADOR']}>
                <Layout><Reportes /></Layout>
              </ProtectedRoute>
            } />
            <Route path='/usuarios' element={
              <ProtectedRoute roles={['PROPIETARIO']}>
                <Layout><Usuarios /></Layout>
              </ProtectedRoute>
            } />
            <Route path='*' element={<Navigate to='/login' />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App