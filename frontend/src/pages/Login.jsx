import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      login(res.data.token, res.data.usuario)
      navigate('/dashboard')
    } catch (err) {
      setError('Credenciales incorrectas. Verifica tu email y contrasena.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className='min-h-screen bg-black flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>

        <div className='text-center mb-8'>
          <div className='inline-block mb-4'>
            <div className='w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-900'>
              <span className='text-3xl'>??</span>
            </div>
          </div>
          <p className='text-gray-400 text-xs tracking-widest uppercase mb-1'>Carwash & Detailing</p>
          <h1 className='text-4xl font-black text-white'>
            <span className='text-red-500'>MR.</span> OSO
          </h1>
          <p className='text-gray-500 text-sm mt-2'>Sistema de Gestion Multisucursal</p>
        </div>

        <div className='bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8'>
          <h2 className='text-white font-bold text-lg mb-6 text-center'>Iniciar Sesion</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-400 mb-1'>Correo electronico</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition placeholder-gray-600'
                placeholder='tu@email.com'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-400 mb-1'>Contrasena</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition placeholder-gray-600'
                placeholder='��������'
                required
              />
            </div>
            {error && (
              <div className='bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg text-sm'>
                {error}
              </div>
            )}
            <button
              type='submit'
              disabled={cargando}
              className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-red-900/50 disabled:opacity-50 text-base mt-2'
            >
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p className='text-center text-gray-600 text-xs mt-6'>
          Sistema de gestion interno � Solo personal autorizado
        </p>
      </div>
    </div>
  )
}

export default Login
