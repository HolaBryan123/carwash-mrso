import prisma from '../utils/prisma.js'

// Registrar un ingreso (operario registra un servicio)
export const createIngreso = async (req, res) => {
    try {
        const { placa, servicioId, monto, notas } = req.body
        const { id: usuarioId, sucursalId } = req.usuario

        if (!sucursalId) {
            return res.status(400).json({ mensaje: 'El usuario no tiene sucursal asignada' })
        }

        const ingreso = await prisma.ingreso.create({
            data: {
                placa: placa.toUpperCase(),
                servicioId: parseInt(servicioId),
                monto: parseFloat(monto),
                notas,
                usuarioId,
                sucursalId
            },
            include: {
                servicio: true,
                sucursal: true,
                usuario: {
                    select: { id: true, nombre: true }
                }
            }
        })

        res.status(201).json(ingreso)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}

// Obtener ingresos del día por sucursal
export const getIngresosDia = async (req, res) => {
    try {
        const { sucursalId } = req.params
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        const manana = new Date(hoy)
        manana.setDate(manana.getDate() + 1)

        const ingresos = await prisma.ingreso.findMany({
            where: {
                sucursalId: parseInt(sucursalId),
                creadoEn: { gte: hoy, lt: manana }
            },
            include: {
                servicio: true,
                usuario: { select: { id: true, nombre: true } }
            },
            orderBy: { creadoEn: 'desc' }
        })

        const total = ingresos.reduce((sum, i) => sum + parseFloat(i.monto), 0)

        res.json({ ingresos, total, cantidad: ingresos.length })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}

// Obtener ingresos por rango de fechas
export const getIngresosFecha = async (req, res) => {
    try {
        const { sucursalId, desde, hasta } = req.query

        const where = {
            creadoEn: {
                gte: new Date(desde),
                lte: new Date(hasta)
            }
        }

        if (sucursalId) {
            where.sucursalId = parseInt(sucursalId)
        }

        // Si es operador solo ve su sucursal
        if (req.usuario.rol === 'OPERADOR') {
            where.sucursalId = req.usuario.sucursalId
        }

        const ingresos = await prisma.ingreso.findMany({
            where,
            include: {
                servicio: true,
                sucursal: true,
                usuario: { select: { id: true, nombre: true } }
            },
            orderBy: { creadoEn: 'desc' }
        })

        const total = ingresos.reduce((sum, i) => sum + parseFloat(i.monto), 0)

        res.json({ ingresos, total, cantidad: ingresos.length })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}

// Resumen del día — todos las sucursales (solo propietario)
export const getResumenDia = async (req, res) => {
    try {
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        const manana = new Date(hoy)
        manana.setDate(manana.getDate() + 1)

        const sucursales = await prisma.sucursal.findMany({
            where: { activa: true }
        })

        const resumen = await Promise.all(
            sucursales.map(async (s) => {
                const ingresos = await prisma.ingreso.findMany({
                    where: {
                        sucursalId: s.id,
                        creadoEn: { gte: hoy, lt: manana }
                    }
                })
                const total = ingresos.reduce((sum, i) => sum + parseFloat(i.monto), 0)
                return {
                    sucursal: s.nombre,
                    sucursalId: s.id,
                    cantidad: ingresos.length,
                    total
                }
            })
        )

        const totalGeneral = resumen.reduce((sum, s) => sum + s.total, 0)

        res.json({ resumen, totalGeneral })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}