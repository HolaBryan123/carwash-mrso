import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const KPICard = ({ titulo, valor, color, icono }) => (
  <div className={`bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-5 border-l-4 ${color} hover:scale-105 transition-transform duration-200`}>
    <div className='flex justify-between items-start'>
      <div>
        <p className='text-sm text-gray-500 dark:text-gray-400 font-medium'>{titulo}</p>
        <p className='text-3xl font-black text-gray-800 dark:text-white mt-1'>{valor}</p>
      </div>
      <span className='text-3xl'>{icono}</span>
    </div>
  </div>
)

const Dashboard = () => {
  const { usuario } = useAuth()
  const [kpis, setKpis] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarKpis = async () => {
      try {
        const res = await api.get('/reportes/kpis')
        setKpis(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setCargando(false)
      }
    }
    cargarKpis()
  }, [])

  if (cargando) return (
    <div className='flex items-center justify-center h-64'>
      <div className='flex flex-col items-center gap-3'>
        <div className='w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin'></div>
        <p className='text-gray-500 dark:text-gray-400 text-sm'>Cargando datos...</p>
      </div>
    </div>
  )

  return (
    <div className='p-6'>
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-1'>
          <div className='w-1 h-8 bg-red-600 rounded-full'></div>
          <h1 className='text-2xl font-black text-gray-800 dark:text-white'>Dashboard</h1>
        </div>
        <p className='text-gray-500 dark:text-gray-400 text-sm ml-4'>
          Bienvenido, <span className='text-red-500 font-semibold'>{usuario?.nombre}</span> - Resumen del dia de hoy
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <KPICard titulo='Vehiculos hoy' valor={kpis?.vehiculosHoy || 0} color='border-red-500' icono='??' />
        <KPICard titulo='Ingresos hoy' valor={'Q ' + (kpis?.ingresoHoy?.toFixed(2) || '0.00')} color='border-green-500' icono='??' />
        <KPICard titulo='Vehiculos este mes' valor={kpis?.vehiculosMes || 0} color='border-yellow-500' icono='??' />
        <KPICard titulo='Ingresos este mes' valor={'Q ' + (kpis?.ingresoMes?.toFixed(2) || '0.00')} color='border-purple-500' icono='??' />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6'>
          <div className='flex items-center gap-2 mb-4'>
            <div className='w-1 h-5 bg-red-600 rounded-full'></div>
            <h2 className='text-lg font-bold text-gray-800 dark:text-white'>Servicios en catalogo</h2>
          </div>
          <div className='flex items-end gap-2'>
            <p className='text-5xl font-black text-red-500'>{kpis?.totalServicios || 0}</p>
            <p className='text-gray-400 text-sm mb-2'>servicios activos</p>
          </div>
        </div>

        <div className='bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6'>
          <div className='flex items-center gap-2 mb-4'>
            <div className='w-1 h-5 bg-red-600 rounded-full'></div>
            <h2 className='text-lg font-bold text-gray-800 dark:text-white'>Accesos rapidos</h2>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <a href='/ingresos' className='bg-red-600 hover:bg-red-700 text-white rounded-lg p-3 text-center text-sm font-semibold transition'>
              Registrar servicio
            </a>
            <a href='/reportes' className='bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg p-3 text-center text-sm font-semibold transition'>
              Ver reportes
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
