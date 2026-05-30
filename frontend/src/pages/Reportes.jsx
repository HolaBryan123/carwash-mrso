import { useState } from 'react'
import api from '../services/api'

const Reportes = () => {
  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [reporte, setReporte] = useState(null)
  const [cargando, setCargando] = useState(false)

  const cargarReporte = async () => {
    setCargando(true)
    try {
      const res = await api.get('/reportes/mensual', { params: { mes, anio } })
      setReporte(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

  return (
    <div className='p-6'>
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-1'>
          <div className='w-1 h-8 bg-red-600 rounded-full'></div>
          <h1 className='text-2xl font-black text-gray-800 dark:text-white'>Reportes</h1>
        </div>
        <p className='text-gray-500 dark:text-gray-400 text-sm ml-4'>Analisis de ingresos y servicios por periodo</p>
      </div>

      <div className='bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-zinc-700 mb-6'>
        <div className='flex items-center gap-2 mb-5'>
          <div className='w-1 h-5 bg-red-600 rounded-full'></div>
          <h2 className='text-lg font-bold text-gray-800 dark:text-white'>Reporte Mensual</h2>
        </div>
        <div className='flex flex-wrap gap-4 items-end'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Mes</label>
            <select
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className='bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-800 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition'
            >
              {meses.map((m, i) => (
                <option key={i+1} value={i+1}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Año</label>
            <input
              type='number'
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              className='bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-800 dark:text-white rounded-lg px-4 py-2.5 w-28 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition'
            />
          </div>
          <button
            onClick={cargarReporte}
            disabled={cargando}
            className='bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg transition shadow-lg shadow-red-900/30 disabled:opacity-50'
          >
            {cargando ? 'Generando...' : 'Generar reporte'}
          </button>
        </div>
      </div>

      {reporte && (
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-5 border-l-4 border-green-500'>
              <p className='text-sm text-gray-500 dark:text-gray-400 font-medium'>Total del mes</p>
              <p className='text-4xl font-black text-green-500 mt-1'>Q {reporte.totalGeneral?.toFixed(2)}</p>
            </div>
            <div className='bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-5 border-l-4 border-red-500'>
              <p className='text-sm text-gray-500 dark:text-gray-400 font-medium'>Total de servicios</p>
              <p className='text-4xl font-black text-red-500 mt-1'>{reporte.cantidadServicios}</p>
            </div>
          </div>

          <div className='bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-zinc-700'>
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-1 h-5 bg-red-600 rounded-full'></div>
              <h3 className='text-lg font-bold text-gray-800 dark:text-white'>Desglose por servicio</h3>
            </div>
            {Object.keys(reporte.porServicio).length === 0 ? (
              <div className='flex flex-col items-center justify-center h-32 text-gray-400'>
                <p className='text-sm'>No hay datos para este periodo</p>
              </div>
            ) : (
              <div className='space-y-2'>
                {Object.entries(reporte.porServicio).map(([nombre, datos]) => (
                  <div key={nombre} className='flex justify-between items-center bg-gray-50 dark:bg-zinc-700 rounded-lg px-4 py-3'>
                    <span className='text-gray-700 dark:text-gray-300 font-medium'>{nombre}</span>
                    <div className='flex gap-6'>
                      <span className='text-gray-500 dark:text-gray-400 text-sm'>{datos.cantidad} servicios</span>
                      <span className='font-black text-green-500'>Q {datos.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Reportes
