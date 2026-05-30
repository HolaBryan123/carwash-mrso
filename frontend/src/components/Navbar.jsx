import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const { usuario, logout } = useAuth()
  const { darkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className='bg-black border-b-2 border-red-600 text-white px-6 py-3 flex justify-between items-center shadow-lg'>
      <div className='flex items-center gap-3'>
        <div className='flex flex-col leading-none'>
          <span className='text-xs text-gray-400 font-light tracking-widest uppercase'>Carwash & Detailing</span>
          <div className='flex items-center gap-1'>
            <span className='text-red-500 font-black text-xl tracking-tight'>MR.</span>
            <span className='text-white font-black text-xl'>OSO</span>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-5'>
        <Link to='/dashboard' className='text-sm text-gray-300 hover:text-red-400 transition font-medium'>
          Dashboard
        </Link>
        {usuario?.rol !== 'OPERADOR' && (
          <Link to='/reportes' className='text-sm text-gray-300 hover:text-red-400 transition font-medium'>
            Reportes
          </Link>
        )}
        <Link to='/ingresos' className='text-sm text-gray-300 hover:text-red-400 transition font-medium'>
          Registrar
        </Link>
        {(usuario?.rol === 'PROPIETARIO' || usuario?.rol === 'ADMINISTRADOR') && (
          <Link to='/servicios' className='text-sm text-gray-300 hover:text-red-400 transition font-medium'>
            Servicios
          </Link>
        )}

        <button
          onClick={toggleTheme}
          className='w-9 h-9 rounded-full flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 transition text-lg'
          title={darkMode ? 'Modo claro' : 'Modo oscuro'}
        >
          {darkMode ? '??' : '??'}
        </button>

        <div className='flex items-center gap-2 border-l border-zinc-700 pl-4'>
          <div className='text-right'>
            <p className='text-xs text-gray-400'>{usuario?.rol}</p>
            <p className='text-sm font-semibold text-white'>{usuario?.nombre}</p>
          </div>
          <button
            onClick={handleLogout}
            className='bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition'
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
