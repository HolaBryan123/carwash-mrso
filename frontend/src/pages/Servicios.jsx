import { useState, useEffect } from 'react'
import api from '../services/api'

const Servicios = () => {
  const [servicios, setServicios] = useState([])
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const cargarServicios = async () => {
    const res = await api.get('/servicios')
    setServicios(res.data)
  }

  useEffect(() => { cargarServicios() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setMensaje('')
    setError('')
    try {
      await api.post('/servicios', { nombre, descripcion, precio })
      setMensaje('Servicio creado correctamente')
      setNombre('')
      setDescripcion('')
      setPrecio('')
      cargarServicios()
    } catch (err) {
      setError('Error al crear el servicio')
    } finally {
      setCargando(false)
    }
  }

  const desactivar = async (id) => {
    if (!confirm('Desactivar este servicio?')) return
    await api.delete('/servicios/' + id)
    cargarServicios()
  }

  return (
    <div className='p-6'>
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-1'>
          <div className='w-1 h-8 bg-red-600 rounded-full'></div>
          <h1 className='text-2xl font-black text-gray-800 dark:text-white'>Catalogo de Servicios</h1>
        </div>
        <p className='text-gray-500 dark:text-gray-400 text-sm ml-4'>Administra los servicios disponibles en el sistema</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-zinc-700'>
          <div className='flex items-center gap-2 mb-5'>
            <div className='w-1 h-5 bg-red-600 rounded-full'></div>
            <h2 className='text-lg font-bold text-gray-800 dark:text-white'>Agregar nuevo servicio</h2>
          </div>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Nombre del servicio</label>
              <input
                type='text'
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className='w-full bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition'
                placeholder='Ej: Lavado exterior basico'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Descripcion</label>
              <input
                type='text'
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className='w-full bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition'
                placeholder='Descripcion breve del servicio'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Precio (Q)</label>
              <div className='relative'>
                <span className='absolute left-4 top-3 text-gray-400 font-bold'>Q</span>
                <input
                  type='number'
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className='w-full bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-800 dark:text-white rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition'
                  placeholder='0.00'
                  required
                />
              </div>
            </div>
            {mensaje && (
              <div className='bg-green-900/20 border border-green-600 text-green-500 px-4 py-3 rounded-lg text-sm font-medium'>
                ? {mensaje}
              </div>
            )}
            {error && (
              <div className='bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg text-sm font-medium'>
                ? {error}
              </div>
            )}
            <button
              type='submit'
              disabled={cargando}
              className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-red-900/30 disabled:opacity-50'
            >
              {cargando ? 'Guardando...' : 'Agregar Servicio'}
            </button>
          </form>
        </div>

        <div className='bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-zinc-700'>
          <div className='flex items-center justify-between mb-5'>
            <div className='flex items-center gap-2'>
              <div className='w-1 h-5 bg-red-600 rounded-full'></div>
              <h2 className='text-lg font-bold text-gray-800 dark:text-white'>Servicios activos</h2>
            </div>
            <span className='bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full'>{servicios.length}</span>
          </div>
          <div className='space-y-2 max-h-96 overflow-y-auto'>
            {servicios.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-48 text-gray-400'>
                <span className='text-4xl mb-2'>??</span>
                <p className='text-sm'>No hay servicios registrados</p>
              </div>
            ) : (
              servicios.map(s => (
                <div key={s.id} className='flex justify-between items-center bg-gray-50 dark:bg-zinc-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-zinc-600 transition'>
                  <div className='flex-1'>
                    <p className='font-semibold text-gray-800 dark:text-white'>{s.nombre}</p>
                    {s.descripcion && <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>{s.descripcion}</p>}
                  </div>
                  <div className='flex items-center gap-3 ml-3'>
                    <span className='font-black text-green-500 text-lg'>Q{s.precio}</span>
                    <button
                      onClick={() => desactivar(s.id)}
                      className='text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded transition text-xs font-semibold'
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Servicios
