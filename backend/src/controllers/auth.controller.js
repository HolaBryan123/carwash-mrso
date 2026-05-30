import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma.js'

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const usuario = await prisma.usuario.findUnique({
            where: { email },
            include: { sucursal: true }
        })

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' })
        }

        if (!usuario.activo) {
            return res.status(401).json({ mensaje: 'Usuario desactivado' })
        }

        const passwordValido = await bcrypt.compare(password, usuario.password)
        if (!passwordValido) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' })
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol,
                sucursalId: usuario.sucursalId
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        )

        res.json({
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                sucursal: usuario.sucursal
            }
        })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}

// Obtener perfil
export const perfil = async (req, res) => {
    try {
        const usuario = await prisma.usuario.findUnique({
            where: { id: req.usuario.id },
            select: {
                id: true,
                nombre: true,
                email: true,
                rol: true,
                sucursal: true
            }
        })
        res.json(usuario)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}