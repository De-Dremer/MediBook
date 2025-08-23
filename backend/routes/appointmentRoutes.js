const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authUser } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Apply authentication to all appointment routes
router.use(authUser);

// ✅ GET /api/appointments/my-appointments
router.get('/my-appointments', async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            where: { patientId: req.user.userId },
            include: {
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        specialization: true,
                        location: true,
                        profileImage: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        });

        const formattedAppointments = appointments.map(apt => ({
            id: apt.id,
            doctorId: apt.doctorId,
            doctorName: apt.doctor.name,
            doctorImage: apt.doctor.profileImage,
            specialization: apt.doctor.specialization || 'General Medicine',
            date: apt.date.toISOString().split('T')[0],
            time: apt.time,
            status: apt.status.toLowerCase(),
            appointmentType: apt.appointmentType || 'consultation',
            consultationFee: apt.consultationFee || 1000,
            location: apt.doctor.location || 'Mumbai',
            symptoms: apt.symptoms,
            notes: apt.notes,
            createdAt: apt.createdAt.toISOString()
        }));

        res.json({
            success: true,
            appointments: formattedAppointments
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments'
        });
    }
});

// ✅ POST /api/appointments/book
router.post('/book', async (req, res) => {
    try {
        const { doctorId, date, time, appointmentType, symptoms } = req.body;
        const patientId = req.user.userId;

        if (!doctorId || !date || !time) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID, date, and time are required'
            });
        }

        const doctor = await prisma.user.findFirst({
            where: { id: doctorId, role: 'DOCTOR', isVerified: true }
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        const appointment = await prisma.appointment.create({
            data: {
                patientId,
                doctorId,
                date: new Date(date),
                time,
                appointmentType: appointmentType || 'consultation',
                symptoms: symptoms || null,
                status: 'UPCOMING',
                consultationFee: doctor.consultationFee || 1000
            }
        });

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            appointment: {
                id: appointment.id,
                date: appointment.date.toISOString().split('T')[0],
                time: appointment.time,
                status: appointment.status.toLowerCase()
            }
        });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to book appointment'
        });
    }
});

module.exports = router;
