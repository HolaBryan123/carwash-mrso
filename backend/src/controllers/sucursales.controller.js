import prisma from '../utils/prisma.js'

// Obtener todas las sucursales
export const getSucursales = async (req, res) => {
    try {
        const sucursales = await prisma.sucursal.findMany({
            where: { activa: true },
            include: {
                _count: {
                    select: { usuarios: true, ingresos: true }
                }
            }
        })
        res.json(sucursales)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}

// Obtener una sucursal
export const getSucursal = async (req, res) => {
    try {
        const { id } = req.params
        const sucursal = await prisma.sucursal.findUnique({
            where: { id: parseInt(id) },
            include: {
                usuarios: {
                    select: { id: true, nombre: true, email: true, rol: true }
                }
            }
        })
        if (!sucursal) {
            return res.status(404).json({ mensaje: 'Sucursal no encontrada' })
        }
        res.json(sucursal)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}

// Crear sucursal
export const createSucursal = async (req, res) => {
    try {
        const { nombre, direccion, telefono } = req.body
        const sucursal = await prisma.sucursal.create({
            data: { nombre, direccion, telefono }
        })
        res.status(201).json(sucursal)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}

// Actualizar sucursal
export const updateSucursal = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, direccion, telefono, activa } = req.body
        const sucursal = await prisma.sucursal.update({
            where: { id: parseInt(id) },
            data: { nombre, direccion, telefono, activa }
        })
        res.json(sucursal)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}

// Eliminar sucursal (desactivar)
export const deleteSucursal = async (req, res) => {
    try {
        const { id } = req.params
        await prisma.sucursal.update({
            where: { id: parseInt(id) },
            data: { activa: false }
        })
        res.json({ mensaje: 'Sucursal desactivada correctamente' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}