import { Router } from 'express'
import { getSucursales, getSucursal, createSucursal, updateSucursal, deleteSucursal } from '../controllers/sucursales.controller.js'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { autorizar } from '../middlewares/roles.middleware.js'

const router = Router()

router.get('/', verificarToken, getSucursales)
router.get('/:id', verificarToken, getSucursal)
router.post('/', verificarToken, autorizar('PROPIETARIO'), createSucursal)
router.put('/:id', verificarToken, autorizar('PROPIETARIO', 'ADMINISTRADOR'), updateSucursal)
router.delete('/:id', verificarToken, autorizar('PROPIETARIO'), deleteSucursal)

export default router
