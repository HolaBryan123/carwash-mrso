import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Sidebar = () => {
    const { usuario, logout } = useAuth()
    const { darkMode, toggleTheme } = useTheme()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
            ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
            : 'text-gray-400 hover:text-white hover:bg-zinc-700'
        }`

    return (
        <div className='fixed top-0 left-0 h-screen w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col z-50'>

            {/* Logo */}
            <div className='p-6 border-b border-zinc-800'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/50'>
                        <span className='text-xl'>🐾</span>
                    </div>
                    <div>
                        <p className='text-xs text-gray-500 uppercase tracking-widest'>Carwash & Detailing</p>
                        <p className='text-white font-black text-lg leading-none'>
                            <span className='text-red-500'>MR.</span> OSO
                        </p>
                    </div>
                </div>
            </div>

            {/* Navegacion */}
            <nav className='flex-1 p-4 space-y-1 overflow-y-auto'>
                <p className='text-xs text-gray-600 uppercase tracking-widest px-4 mb-2'>Menu</p>

                <NavLink to='/dashboard' className={linkClass}>
                    <span className='text-lg'>📊</span>
                    Dashboard
                </NavLink>

                <NavLink to='/ingresos' className={linkClass}>
                    <span className='text-lg'>🚗</span>
                    Registrar Servicio
                </NavLink>

                {usuario?.rol !== 'OPERADOR' && (
                    <NavLink to='/reportes' className={linkClass}>
                        <span className='text-lg'>📈</span>
                        Reportes
                    </NavLink>
                )}

                {(usuario?.rol === 'PROPIETARIO' || usuario?.rol === 'ADMINISTRADOR') && (
                    <NavLink to='/servicios' className={linkClass}>
                        <span className='text-lg'>🧹</span>
                        Servicios
                    </NavLink>
                )}

                {usuario?.rol === 'PROPIETARIO' && (
                    <NavLink to='/usuarios' className={linkClass}>
                        <span className='text-lg'>👥</span>
                        Usuarios
                    </NavLink>
                )}
            </nav>

            {/* Footer del sidebar */}
            <div className='p-4 border-t border-zinc-800 space-y-3'>
                {/* Modo oscuro/claro */}
                <button
                    onClick={toggleTheme}
                    className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-zinc-700 transition'
                >
                    <span className='text-lg'>{darkMode ? '☀️' : '🌙'}</span>
                    {darkMode ? 'Modo claro' : 'Modo oscuro'}
                </button>

                {/* Info usuario */}
                <div className='bg-zinc-800 rounded-xl p-3'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-white text-sm font-semibold truncate'>{usuario?.nombre}</p>
                            <p className='text-red-400 text-xs'>{usuario?.rol}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className='bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition'
                        >
                            Salir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar 