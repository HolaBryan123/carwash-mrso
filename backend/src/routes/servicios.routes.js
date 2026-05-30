import { Router } from 'express'
import { getServicios, getServicio, createServicio, updateServicio, deleteServicio } from '../controllers/servicios.controller.js'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { autorizar } from '../middlewares/roles.middleware.js'

const router = Router()

router.get('/', verificarToken, getServicios)
router.get('/:id', verificarToken, getServicio)
router.post('/', verificarToken, autorizar('PROPIETARIO', 'ADMINISTRADOR'), createServicio)
router.put('/:id', verificarToken, autorizar('PROPIETARIO', 'ADMINISTRADOR'), updateServicio)
router.delete('/:id', verificarToken, autorizar('PROPIETARIO'), deleteServicio)

export default router