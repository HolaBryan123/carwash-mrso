import { useState, useEffect } from 'react'
import api from '../services/api'

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([])
    const [sucursales, setSucursales] = useState([])
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rol, setRol] = useState('ADMINISTRADOR')
    const [sucursalId, setSucursalId] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)

    const cargarDatos = async () => {
        try {
            const [u, s] = await Promise.all([
                api.get('/usuarios'),
                api.get('/sucursales')
            ])
            setUsuarios(u.data)
            setSucursales(s.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => { cargarDatos() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCargando(true)
        setMensaje('')
        setError('')
        try {
            await api.post('/usuarios', { nombre, email, password, rol, sucursalId: sucursalId || null })
            setMensaje('Usuario creado correctamente')
            setNombre('')
            setEmail('')
            setPassword('')
            setRol('ADMINISTRADOR')
            setSucursalId('')
            cargarDatos()
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al crear el usuario')
        } finally {
            setCargando(false)
        }
    }

    const desactivar = async (id) => {
        if (!confirm('Desactivar este usuario?')) return
        try {
            await api.delete('/usuarios/' + id)
            cargarDatos()
        } catch (err) {
            console.error(err)
        }
    }

    const rolColor = (rol) => {
        if (rol === 'PROPIETARIO') return 'bg-red-900/30 text-red-400 border border-red-700'
        if (rol === 'ADMINISTRADOR') return 'bg-blue-900/30 text-blue-400 border border-blue-700'
        return 'bg-zinc-700 text-gray-400 border border-zinc-600'
    }

    return (
        <div className='p-6'>
            <div className='mb-8'>
                <div className='flex items-center gap-3 mb-1'>
                    <div className='w-1 h-8 bg-red-600 rounded-full'></div>
                    <h1 className='text-2xl font-black text-gray-800 dark:text-white'>Gestion de Usuarios</h1>
                </div>
                <p className='text-gray-500 dark:text-gray-400 text-sm ml-4'>Crea y administra los usuarios del sistema</p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-zinc-700'>
                    <div className='flex items-center gap-2 mb-5'>
                        <div className='w-1 h-5 bg-red-600 rounded-full'></div>
                        <h2 className='text-lg font-bold text-gray-800 dark:text-white'>Crear nuevo usuario</h2>
                    </div>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Nombre completo</label>
                            <input
                                type='text'
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className='w-full bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition'
                                placeholder='Ej: Juan Perez'
                                required
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Correo electronico</label>
                            <input
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-full bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition'
                                placeholder='correo@ejemplo.com'
                                required
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Contrasena</label>
                            <input
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='w-full bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition'
                                placeholder='Minimo 6 caracteres'
                                required
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Rol</label>
                            <select
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                                className='w-full bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition'
                            >
                                <option value='ADMINISTRADOR'>Administrador de sucursal</option>
                                <option value='OPERADOR'>Operador</option>
                                <option value='PROPIETARIO'>Propietario</option>
                            </select>
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Sucursal asignada</label>
                            <select
                                value={sucursalId}
                                onChange={(e) => setSucursalId(e.target.value)}
                                className='w-full bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition'
                            >
                                <option value=''>Sin sucursal (Propietario)</option>
                                {sucursales.map(s => (
                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                            </select>
                        </div>
                        {mensaje && (
                            <div className='bg-green-900/20 border border-green-600 text-green-500 px-4 py-3 rounded-lg text-sm font-medium'>
                                ✓ {mensaje}
                            </div>
                        )}
                        {error && (
                            <div className='bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg text-sm font-medium'>
                                ✗ {error}
                            </div>
                        )}
                        <button
                            type='submit'
                            disabled={cargando}
                            className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-red-900/30 disabled:opacity-50'
                        >
                            {cargando ? 'Creando...' : 'Crear Usuario'}
                        </button>
                    </form>
                </div>

                <div className='bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-zinc-700'>
                    <div className='flex items-center justify-between mb-5'>
                        <div className='flex items-center gap-2'>
                            <div className='w-1 h-5 bg-red-600 rounded-full'></div>
                            <h2 className='text-lg font-bold text-gray-800 dark:text-white'>Usuarios activos</h2>
                        </div>
                        <span className='bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full'>{usuarios.length}</span>
                    </div>
                    <div className='space-y-3 max-h-96 overflow-y-auto'>
                        {usuarios.length === 0 ? (
                            <div className='flex flex-col items-center justify-center h-48 text-gray-400'>
                                <span className='text-4xl mb-2'>👥</span>
                                <p className='text-sm'>No hay usuarios registrados</p>
                            </div>
                        ) : (
                            usuarios.map(u => (
                                <div key={u.id} className='flex justify-between items-center bg-gray-50 dark:bg-zinc-700 rounded-lg p-4'>
                                    <div className='flex-1'>
                                        <p className='font-semibold text-gray-800 dark:text-white'>{u.nombre}</p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>{u.email}</p>
                                        <div className='flex items-center gap-2 mt-1'>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${rolColor(u.rol)}`}>
                                                {u.rol}
                                            </span>
                                            {u.sucursal && (
                                                <span className='text-xs text-gray-400'>📍 {u.sucursal.nombre}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => desactivar(u.id)}
                                        className='text-red-400 hover:text-red-600 text-xs font-semibold ml-3'
                                    >
                                        Desactivar
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Usuarios