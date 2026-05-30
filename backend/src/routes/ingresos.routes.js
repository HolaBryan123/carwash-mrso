import { Router } from 'express'
import { createIngreso, getIngresosDia, getIngresosFecha, getResumenDia } from '../controllers/ingresos.controller.js'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { autorizar } from '../middlewares/roles.middleware.js'

const router = Router()

router.post('/', verificarToken, createIngreso)
router.get('/dia/:sucursalId', verificarToken, getIngresosDia)
router.get('/fecha', verificarToken, getIngresosFecha)
router.get('/resumen', verificarToken, autorizar('PROPIETARIO'), getResumenDia)

export default router