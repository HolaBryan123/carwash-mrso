import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes.js'
import sucursalesRoutes from './routes/sucursales.routes.js'
import serviciosRoutes from './routes/servicios.routes.js'
import ingresosRoutes from './routes/ingresos.routes.js'
import reportesRoutes from './routes/reportes.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/sucursales', sucursalesRoutes)
app.use('/api/servicios', serviciosRoutes)
app.use('/api/ingresos', ingresosRoutes)
app.use('/api/reportes', reportesRoutes)
app.use('/api/usuarios', usuariosRoutes)

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'API Carwash MR.SO funcionando ✅' })
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})