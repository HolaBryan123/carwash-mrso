import { Router } from 'express'
import { getUsuarios, createUsuario, deleteUsuario } from '../controllers/usuarios.controller.js'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { autorizar } from '../middlewares/roles.middleware.js'

const router = Router()

router.get('/', verificarToken, autorizar('PROPIETARIO'), getUsuarios)
router.post('/', verificarToken, autorizar('PROPIETARIO'), createUsuario)
router.delete('/:id', verificarToken, autorizar('PROPIETARIO'), deleteUsuario)

export default router