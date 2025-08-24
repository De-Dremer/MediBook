const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authUser } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Apply authentication to all appointment routes
router.use(authUser);

// 🔍 DEBUG: Check all doctors in database
router.get('/debug/doctors', async (req, res) => {
    try {
        console.log('🔍 DEBUG: Checking all doctors in database...');
        
        const allDoctors = await prisma.user.findMany({
            where: { role: 'DOCTOR' },
            select: {
                id: true,
                name: true,
                email: true,
                specialization: true,
                createdAt: true
            }
        });
        
        console.log('📊 Total doctors found:', allDoctors.length);
        console.log('📊 Doctors:', allDoctors);
        
        res.json({
            success: true,
            message: 'Debug: All doctors in database',
            count: allDoctors.length,
            doctors: allDoctors
        });
    } catch (error) {
        console.error('❌ Error in debug endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch debug data',
            error: error.message
        });
    }
});

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

        console.log('🔍 Booking appointment - Request data:', { doctorId, date, time, appointmentType, symptoms });
        console.log('🔍 Patient ID:', patientId);

        if (!doctorId || !date || !time) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID, date, and time are required'
            });
        }

        console.log('🔍 Searching for doctor with ID:', doctorId);
        const doctor = await prisma.user.findFirst({
            where: { id: doctorId, role: 'DOCTOR' }
            // Removed isVerified requirement as requested
        });
        
        console.log('🔍 Doctor search result:', doctor ? 'Found' : 'Not found');

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

// ✅ PUT /api/appointments/cancel/:id - Cancel Appointment Route
router.put('/cancel/:id', async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const userId = req.user.userId;
        const userRole = req.user.role;

        console.log('🔄 Cancelling appointment:', appointmentId, 'by user:', userId);

        // Find the appointment
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                patient: { select: { id: true, name: true } },
                doctor: { select: { id: true, name: true } }
            }
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check authorization - only patient or doctor can cancel
        const isAuthorized = (
            appointment.patientId === userId ||
            appointment.doctorId === userId ||
            userRole === 'ADMIN'
        );

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to cancel this appointment'
            });
        }

        // Check if appointment is already cancelled
        if (appointment.status === 'CANCELLED') {
            return res.status(400).json({
                success: false,
                message: 'Appointment is already cancelled'
            });
        }

        // Check if appointment is in the past
        const appointmentDateTime = new Date(appointment.date);
        const now = new Date();

        if (appointmentDateTime < now) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel past appointments'
            });
        }

        // Update appointment status to cancelled
        const updatedAppointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                status: 'CANCELLED',
                updatedAt: new Date()
            },
            include: {
                doctor: { select: { name: true } },
                patient: { select: { name: true } }
            }
        });

        console.log('✅ Appointment cancelled:', appointmentId);

        res.json({
            success: true,
            message: 'Appointment cancelled successfully',
            appointment: {
                id: updatedAppointment.id,
                status: updatedAppointment.status.toLowerCase(),
                doctorName: updatedAppointment.doctor.name,
                date: updatedAppointment.date.toISOString().split('T')[0],
                time: updatedAppointment.time
            }
        });

    } catch (error) {
        console.error('❌ Error cancelling appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel appointment',
            error: error.message
        });
    }
});

// ✅ PUT /api/appointments/reschedule/:id - Reschedule Appointment Route
router.put('/reschedule/:id', async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const { date, time } = req.body;
        const userId = req.user.userId;

        if (!date || !time) {
            return res.status(400).json({
                success: false,
                message: 'Date and time are required'
            });
        }

        console.log('🔄 Rescheduling appointment:', appointmentId);

        // Find the appointment
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId }
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check if user owns this appointment
        if (appointment.patientId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to reschedule this appointment'
            });
        }

        // Check if appointment is cancelled
        if (appointment.status === 'CANCELLED') {
            return res.status(400).json({
                success: false,
                message: 'Cannot reschedule cancelled appointment'
            });
        }

        // Check for time slot conflicts
        const conflictingAppointment = await prisma.appointment.findFirst({
            where: {
                doctorId: appointment.doctorId,
                date: new Date(date),
                time: time,
                status: {
                    not: 'CANCELLED'
                },
                id: {
                    not: appointmentId
                }
            }
        });

        if (conflictingAppointment) {
            return res.status(409).json({
                success: false,
                message: 'This time slot is already booked'
            });
        }

        // Update appointment
        const updatedAppointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                date: new Date(date),
                time: time,
                updatedAt: new Date()
            }
        });

        console.log('✅ Appointment rescheduled:', appointmentId);

        res.json({
            success: true,
            message: 'Appointment rescheduled successfully',
            appointment: {
                id: updatedAppointment.id,
                date: updatedAppointment.date.toISOString().split('T')[0],
                time: updatedAppointment.time
            }
        });

    } catch (error) {
        console.error('❌ Error rescheduling appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reschedule appointment'
        });
    }
});

module.exports = router;
