import prisma from '../utils/prisma.js'

// Reporte mensual por sucursal
export const getReporteMensual = async (req, res) => {
    try {
        const { sucursalId, mes, anio } = req.query

        const inicio = new Date(parseInt(anio), parseInt(mes) - 1, 1)
        const fin = new Date(parseInt(anio), parseInt(mes), 1)

        const where = {
            creadoEn: { gte: inicio, lt: fin }
        }

        if (sucursalId) {
            where.sucursalId = parseInt(sucursalId)
        }

        if (req.usuario.rol === 'OPERADOR' || req.usuario.rol === 'ADMINISTRADOR') {
            where.sucursalId = req.usuario.sucursalId
        }

        const ingresos = await prisma.ingreso.findMany({
            where,
            include: {
                servicio: true,
                sucursal: true,
                usuario: { select: { id: true, nombre: true } }
            },
            orderBy: { creadoEn: 'asc' }
        })

        // Agrupar por servicio
        const porServicio = {}
        ingresos.forEach((i) => {
            const nombre = i.servicio.nombre
            if (!porServicio[nombre]) {
                porServicio[nombre] = { cantidad: 0, total: 0 }
            }
            porServicio[nombre].cantidad++
            porServicio[nombre].total += parseFloat(i.monto)
        })

        // Agrupar por día
        const porDia = {}
        ingresos.forEach((i) => {
            const dia = i.creadoEn.toISOString().split('T')[0]
            if (!porDia[dia]) {
                porDia[dia] = { cantidad: 0, total: 0 }
            }
            porDia[dia].cantidad++
            porDia[dia].total += parseFloat(i.monto)
        })

        const totalGeneral = ingresos.reduce((sum, i) => sum + parseFloat(i.monto), 0)

        res.json({
            totalGeneral,
            cantidadServicios: ingresos.length,
            porServicio,
            porDia,
            ingresos
        })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}

// Reporte comparativo multisucursal (solo propietario)
export const getReporteComparativo = async (req, res) => {
    try {
        const { mes, anio } = req.query

        const inicio = new Date(parseInt(anio), parseInt(mes) - 1, 1)
        const fin = new Date(parseInt(anio), parseInt(mes), 1)

        const sucursales = await prisma.sucursal.findMany({
            where: { activa: true }
        })

        const comparativo = await Promise.all(
            sucursales.map(async (s) => {
                const ingresos = await prisma.ingreso.findMany({
                    where: {
                        sucursalId: s.id,
                        creadoEn: { gte: inicio, lt: fin }
                    },
                    include: { servicio: true }
                })

                const total = ingresos.reduce((sum, i) => sum + parseFloat(i.monto), 0)
                const ticketPromedio = ingresos.length > 0 ? total / ingresos.length : 0

                return {
                    sucursal: s.nombre,
                    sucursalId: s.id,
                    cantidadServicios: ingresos.length,
                    totalIngresos: total,
                    ticketPromedio: ticketPromedio.toFixed(2)
                }
            })
        )

        const totalGeneral = comparativo.reduce((sum, s) => sum + s.totalIngresos, 0)

        res.json({ comparativo, totalGeneral })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}

// KPIs del dashboard
export const getKPIs = async (req, res) => {
    try {
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        const manana = new Date(hoy)
        manana.setDate(manana.getDate() + 1)

        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

        const where = {}
        if (req.usuario.rol !== 'PROPIETARIO') {
            where.sucursalId = req.usuario.sucursalId
        }

        const [ingresosHoy, ingresosMes, totalServicios] = await Promise.all([
            prisma.ingreso.findMany({
                where: { ...where, creadoEn: { gte: hoy, lt: manana } }
            }),
            prisma.ingreso.findMany({
                where: { ...where, creadoEn: { gte: inicioMes } }
            }),
            prisma.catalogoServicio.count({ where: { activo: true } })
        ])

        const totalHoy = ingresosHoy.reduce((sum, i) => sum + parseFloat(i.monto), 0)
        const totalMes = ingresosMes.reduce((sum, i) => sum + parseFloat(i.monto), 0)

        res.json({
            vehiculosHoy: ingresosHoy.length,
            ingresoHoy: totalHoy,
            vehiculosMes: ingresosMes.length,
            ingresoMes: totalMes,
            totalServicios
        })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
    }
}