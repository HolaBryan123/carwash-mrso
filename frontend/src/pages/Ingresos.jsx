import { useState, useEffect } from 'react'
import api from '../services/api'

const Ingresos = () => {
  const [servicios, setServicios] = useState([])
  const [placa, setPlaca] = useState('')
  const [servicioId, setServicioId] = useState('')
  const [monto, setMonto] = useState('')
  const [notas, setNotas] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [registros, setRegistros] = useState([])

  useEffect(() => {
    api.get('/servicios').then(res => setServicios(res.data))
  }, [])

  const handleServicio = (e) => {
    const id = e.target.value
    setServicioId(id)
    const servicio = servicios.find(s => s.id === parseInt(id))
    if (servicio) setMonto(servicio.precio)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setMensaje('')
    setError('')
    try {
      const res = await api.post('/ingresos', { placa, servicioId, monto, notas })
      setMensaje('Servicio registrado correctamente')
      setRegistros(prev => [res.data, ...prev.slice(0, 4)])
      setPlaca('')
      setServicioId('')
      setMonto('')
      setNotas('')
    } catch (err) {
      setError('Error al registrar el servicio. Verifica los datos.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className='p-6'>
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-1'>
          <div className='w-1 h-8 bg-red-600 rounded-full'></div>
          <h1 className='text-2xl font-black text-gray-800 dark:text-white'>Registrar Servicio</h1>
        </div>
        <p className='text-gray-500 dark:text-gray-400 text-sm ml-4'>Ingresa los datos del vehiculo atendido</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-zinc-700'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Placa del vehiculo</label>
              <input
                type='text'
                value={placa}
                onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                className='w-full bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition font-mono text-lg tracking-widest placeholder-gray-400'
                placeholder='ABC-123'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Tipo de servicio</label>
              <select
                value={servicioId}
                onChange={handleServicio}
                className='w-full bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition'
                required
              >
                <option value=''>Seleccionar servicio...</option>
                {servicios.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre} — Q{s.precio}</option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Monto cobrado (Q)</label>
              <div className='relative'>
                <span className='absolute left-4 top-3 text-gray-400 font-bold'>Q</span>
                <input
                  type='number'
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className='w-full bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-800 dark:text-white rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition'
                  placeholder='0.00'
                  required
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Notas (opcional)</label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className='w-full bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition resize-none'
                placeholder='Observaciones del servicio...'
                rows={2}
              />
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
              className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition shadow-lg shadow-red-900/30 disabled:opacity-50 text-lg'
            >
              {cargando ? 'Registrando...' : 'Registrar Servicio'}
            </button>
          </form>
        </div>

        <div className='bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-zinc-700'>
          <div className='flex items-center gap-2 mb-4'>
            <div className='w-1 h-5 bg-red-600 rounded-full'></div>
            <h2 className='text-lg font-bold text-gray-800 dark:text-white'>Ultimos registros</h2>
          </div>
          {registros.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-48 text-gray-400'>
              <span className='text-4xl mb-2'>??</span>
              <p className='text-sm'>Los registros apareceran aqui</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {registros.map((r, i) => (
                <div key={i} className='flex justify-between items-center bg-gray-50 dark:bg-zinc-700 rounded-lg p-3'>
                  <div>
                    <p className='font-mono font-bold text-gray-800 dark:text-white'>{r.placa}</p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>{r.servicio?.nombre}</p>
                  </div>
                  <span className='font-bold text-green-500'>Q {parseFloat(r.monto).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Ingresos
