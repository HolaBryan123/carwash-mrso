import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, roles }) => {
  const { usuario, cargando } = useAuth()

  if (cargando) return <div className='flex items-center justify-center h-screen'>Cargando...</div>

  if (!usuario) return <Navigate to='/login' />

  if (roles && !roles.includes(usuario.rol)) return <Navigate to='/dashboard' />

  return children
}

export default ProtectedRoute
