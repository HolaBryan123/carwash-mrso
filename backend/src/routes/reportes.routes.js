import { Router } from 'express'
import { getReporteMensual, getReporteComparativo, getKPIs } from '../controllers/reportes.controller.js'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { autorizar } from '../middlewares/roles.middleware.js'

const router = Router()

router.get('/kpis', verificarToken, getKPIs)
router.get('/mensual', verificarToken, getReporteMensual)
router.get('/comparativo', verificarToken, autorizar('PROPIETARIO'), getReporteComparativo)

export default router