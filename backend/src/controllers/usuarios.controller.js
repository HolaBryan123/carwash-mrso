import bcrypt from 'bcryptjs'
import prisma from '../utils/prisma.js'

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            where: { activo: true },
            select: {
                id: true,
                nombre: true,
                email: true,
                rol: true,
                creadoEn: true,
                sucursal: {
                    select: { id: true, nombre: true }
                }
            },
            orderBy: { creadoEn: 'desc' }
        })
        res.json(usuarios)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}

// Crear usuario
export const createUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol, sucursalId } = req.body

        const existente = await prisma.usuario.findUnique({ where: { email } })
        if (existente) {
            return res.status(400).json({ mensaje: 'Ya existe un usuario con ese correo' })
        }

        const hash = await bcrypt.hash(password, 10)

        const usuario = await prisma.usuario.create({
            data: {
                nombre,
                email,
                password: hash,
                rol,
                sucursalId: sucursalId ? parseInt(sucursalId) : null
            },
            select: {
                id: true,
                nombre: true,
                email: true,
                rol: true,
                sucursal: { select: { id: true, nombre: true } }
            }
        })

        res.status(201).json(usuario)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}

// Desactivar usuario
export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params

        if (parseInt(id) === req.usuario.id) {
            return res.status(400).json({ mensaje: 'No puedes desactivar tu propio usuario' })
        }

        await prisma.usuario.update({
            where: { id: parseInt(id) },
            data: { activo: false }
        })

        res.json({ mensaje: 'Usuario desactivado correctamente' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}