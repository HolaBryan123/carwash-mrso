import prisma from '../utils/prisma.js'

// Obtener todos los servicios
export const getServicios = async (req, res) => {
    try {
        const servicios = await prisma.catalogoServicio.findMany({
            where: { activo: true },
            orderBy: { nombre: 'asc' }
        })
        res.json(servicios)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}

// Obtener un servicio
export const getServicio = async (req, res) => {
    try {
        const { id } = req.params
        const servicio = await prisma.catalogoServicio.findUnique({
            where: { id: parseInt(id) }
        })
        if (!servicio) {
            return res.status(404).json({ mensaje: 'Servicio no encontrado' })
        }
        res.json(servicio)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}

// Crear servicio
export const createServicio = async (req, res) => {
    try {
        const { nombre, descripcion, precio } = req.body
        const servicio = await prisma.catalogoServicio.create({
            data: { nombre, descripcion, precio: parseFloat(precio) }
        })
        res.status(201).json(servicio)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}

// Actualizar servicio
export const updateServicio = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, descripcion, precio, activo } = req.body
        const servicio = await prisma.catalogoServicio.update({
            where: { id: parseInt(id) },
            data: { nombre, descripcion, precio: parseFloat(precio), activo }
        })
        res.json(servicio)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}

// Eliminar servicio (desactivar)
export const deleteServicio = async (req, res) => {
    try {
        const { id } = req.params
        await prisma.catalogoServicio.update({
            where: { id: parseInt(id) },
            data: { activo: false }
        })
        res.json({ mensaje: 'Servicio desactivado correctamente' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}