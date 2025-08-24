const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authUser } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// 🔍 DEBUG: Check all users in database
router.get('/debug/users', async (req, res) => {
    try {
        console.log('🔍 DEBUG: Checking all users in database...');
        
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                specialization: true,
                createdAt: true
            }
        });
        
        console.log('📊 DEBUG: All users found:', allUsers);
        
        const doctors = allUsers.filter(user => user.role === 'DOCTOR');
        const patients = allUsers.filter(user => user.role === 'PATIENT');
        
        res.json({
            success: true,
            debug: {
                totalUsers: allUsers.length,
                doctors: doctors.length,
                patients: patients.length,
                allUsers: allUsers,
                doctors: doctors
            }
        });
    } catch (error) {
        console.error('❌ DEBUG Error:', error);
        res.status(500).json({
            success: false,
            message: 'Debug endpoint error',
            error: error.message
        });
    }
});

// ✅ GET /api/doctors - Get all doctors (Public Route)
router.get('/', async (req, res) => {
    try {
        console.log('📥 GET /doctors called');
        const { search, specialization, location } = req.query;

        const where = {
            role: 'DOCTOR'
            // Removed isVerified requirement as requested
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { specialization: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (specialization && specialization !== 'All Specializations') {
            where.specialization = specialization;
        }

        if (location) {
            where.location = location;
        }

        console.log('🔍 Database query where clause:', where);

        const doctors = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                specialization: true,
                qualification: true,
                experience: true,
                consultationFee: true,
                location: true,
                about: true,
                profileImage: true,
                rating: true,
                reviewCount: true
            },
            orderBy: { rating: 'desc' }
        });

        console.log('📊 Raw doctors from database:', doctors);
        console.log('📊 Total doctors found:', doctors.length);

        const formattedDoctors = doctors.map(doctor => ({
            id: doctor.id,
            name: doctor.name,
            specialization: doctor.specialization || 'General Medicine',
            qualification: doctor.qualification || 'MBBS',
            experience: doctor.experience || 5,
            rating: doctor.rating || 4.5,
            reviewCount: doctor.reviewCount || 0,
            consultationFee: doctor.consultationFee || 1000,
            location: doctor.location || 'Mumbai',
            availability: 'Available Today',
            image: doctor.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=3b82f6&color=fff&size=150`,
            about: doctor.about || `Experienced ${doctor.specialization || 'General Medicine'} practitioner.`
        }));

        console.log('✅ Formatted doctors:', formattedDoctors);

        res.json({
            success: true,
            doctors: formattedDoctors,
            count: formattedDoctors.length
        });
    } catch (error) {
        console.error('❌ Error in GET /doctors:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctors'
        });
    }
});

// ✅ GET /api/doctors/dashboard/stats - Get Doctor Dashboard Stats (Protected)
router.get('/dashboard/stats', authUser, async (req, res) => {
    try {
        const doctorId = req.user.userId;

        console.log('📊 Fetching dashboard stats for doctor:', doctorId);

        // Get today's date range
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Count total appointments for this doctor
        const totalAppointments = await prisma.appointment.count({
            where: {
                doctorId: doctorId
            }
        });

        // Count today's appointments (non-cancelled)
        const todaysAppointments = await prisma.appointment.count({
            where: {
                doctorId: doctorId,
                date: {
                    gte: todayStart,
                    lte: todayEnd
                },
                status: {
                    not: 'CANCELLED'
                }
            }
        });

        // Get next upcoming appointment
        const nextAppointment = await prisma.appointment.findFirst({
            where: {
                doctorId: doctorId,
                date: {
                    gte: new Date()
                },
                status: {
                    not: 'CANCELLED'
                }
            },
            include: {
                patient: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: [
                { date: 'asc' },
                { time: 'asc' }
            ]
        });

        // Calculate percentage change (mock calculation - you can implement based on historical data)
        const lastMonthAppointments = Math.max(0, totalAppointments - Math.floor(Math.random() * 20));
        const percentageChange = lastMonthAppointments > 0
            ? Math.round(((totalAppointments - lastMonthAppointments) / lastMonthAppointments) * 100)
            : 0;

        const stats = {
            totalAppointments,
            todaysAppointments,
            percentageChange: percentageChange > 0 ? `+${percentageChange}%` : `${percentageChange}%`,
            nextAppointmentTime: nextAppointment
                ? nextAppointment.time
                : 'No upcoming appointments',
            nextAppointmentPatient: nextAppointment?.patient?.name || null,
            nextAppointmentDate: nextAppointment?.date || null
        };

        console.log('✅ Dashboard stats:', stats);

        res.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error('❌ Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
});

// ✅ GET /api/doctors/profile - Get Doctor Profile (Protected)
// ✅ GET /api/doctors/profile - Debug version
router.get('/profile', authUser, async (req, res) => {
    try {
        console.log('🔍 DEBUG: Getting profile for user:', req.user);
        console.log('🔍 DEBUG: User ID:', req.user.userId);
        console.log('🔍 DEBUG: User role:', req.user.role);

        const doctorId = req.user.userId;

        const doctor = await prisma.user.findUnique({
            where: {
                id: doctorId,
                role: 'DOCTOR'
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                specialization: true,
                qualification: true,
                experience: true,
                consultationFee: true,
                location: true,
                about: true,
                profileImage: true,
                rating: true,
                reviewCount: true,
                dateOfBirth: true,
                gender: true,
                isVerified: true,
                createdAt: true
            }
        });

        console.log('🔍 DEBUG: Doctor found in database:', doctor);

        if (!doctor) {
            console.log('❌ DEBUG: No doctor found with ID:', doctorId);
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found'
            });
        }

        console.log('✅ DEBUG: Returning doctor profile:', doctor.name);

        res.json({
            success: true,
            doctor
        });

    } catch (error) {
        console.error('❌ Error fetching doctor profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctor profile'
        });
    }
});


// ✅ PUT /api/doctors/profile - Update Doctor Profile (Protected)
router.put('/profile', authUser, async (req, res) => {
    try {
        const doctorId = req.user.userId;
        const {
            name,
            phone,
            specialization,
            qualification,
            experience,
            consultationFee,
            location,
            about,
            profileImage,
            dateOfBirth,
            gender
        } = req.body;

        console.log('🔄 Updating doctor profile:', doctorId);

        // Validate required fields
        if (!name || !specialization || !qualification || !experience || !consultationFee || !location) {
            return res.status(400).json({
                success: false,
                message: 'Name, specialization, qualification, experience, consultation fee, and location are required'
            });
        }

        // Prepare update data
        const updateData = {
            name: name.trim(),
            phone: phone || null,
            specialization,
            qualification,
            experience: parseInt(experience),
            consultationFee: parseInt(consultationFee),
            location,
            about: about || null,
            profileImage: profileImage || null,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            gender: gender?.toUpperCase() || null,
            updatedAt: new Date()
        };

        const updatedDoctor = await prisma.user.update({
            where: {
                id: doctorId,
                role: 'DOCTOR'
            },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                specialization: true,
                qualification: true,
                experience: true,
                consultationFee: true,
                location: true,
                about: true,
                profileImage: true,
                rating: true,
                reviewCount: true,
                dateOfBirth: true,
                gender: true,
                updatedAt: true
            }
        });

        console.log('✅ Doctor profile updated successfully');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            doctor: updatedDoctor
        });

    } catch (error) {
        console.error('❌ Error updating doctor profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update doctor profile',
            error: error.message
        });
    }
});

// ✅ GET /api/doctors/appointments - Get Doctor's Appointments (Protected)
router.get('/appointments', authUser, async (req, res) => {
    try {
        const doctorId = req.user.userId;
        
        console.log('🔍 Fetching appointments for doctor:', doctorId);

        // Verify the user is a doctor
        if (req.user.role !== 'DOCTOR') {
            return res.status(403).json({
                success: false,
                message: 'Only doctors can access this endpoint'
            });
        }

        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId: doctorId
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        phone: true
                    }
                }
            },
            orderBy: [
                { date: 'asc' },
                { time: 'asc' }
            ]
        });

        console.log('📊 Found appointments:', appointments.length);

        const formattedAppointments = appointments.map(apt => ({
            id: apt.id,
            patientId: apt.patientId,
            patientName: apt.patient.name,
            patientPhone: apt.patient.phone,
            date: apt.date.toISOString().split('T')[0],
            time: apt.time,
            status: apt.status.toLowerCase(),
            appointmentType: apt.appointmentType || 'consultation',
            symptoms: apt.symptoms,
            notes: apt.notes,
            consultationFee: apt.consultationFee || 1000,
            createdAt: apt.createdAt.toISOString()
        }));

        console.log('✅ Returning formatted appointments:', formattedAppointments.length);

        res.json({
            success: true,
            appointments: formattedAppointments
        });

    } catch (error) {
        console.error('❌ Error fetching doctor appointments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments',
            error: error.message
        });
    }
});

// ✅ PUT /api/doctors/appointments/:id/complete - Complete Appointment (Protected)
router.put('/appointments/:id/complete', authUser, async (req, res) => {
    try {
        const appointmentId = parseInt(req.params.id);
        const doctorId = req.user.userId;

        console.log('🔄 Completing appointment:', appointmentId, 'for doctor:', doctorId);

        // Verify the user is a doctor
        if (req.user.role !== 'DOCTOR') {
            return res.status(403).json({
                success: false,
                message: 'Only doctors can complete appointments'
            });
        }

        // Find and update the appointment
        const appointment = await prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                doctorId: doctorId
            }
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found or not authorized'
            });
        }

        const updatedAppointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                status: 'COMPLETED',
                updatedAt: new Date()
            }
        });

        console.log('✅ Appointment completed:', appointmentId);

        res.json({
            success: true,
            message: 'Appointment marked as completed',
            appointment: {
                id: updatedAppointment.id,
                status: updatedAppointment.status.toLowerCase()
            }
        });

    } catch (error) {
        console.error('❌ Error completing appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete appointment',
            error: error.message
        });
    }
});

// ✅ PUT /api/doctors/appointments/:id/notes - Add/Update Notes (Protected)
router.put('/appointments/:id/notes', authUser, async (req, res) => {
    try {
        const appointmentId = parseInt(req.params.id);
        const doctorId = req.user.userId;
        const { notes } = req.body;

        console.log('🔄 Adding notes to appointment:', appointmentId, 'for doctor:', doctorId);

        // Verify the user is a doctor
        if (req.user.role !== 'DOCTOR') {
            return res.status(403).json({
                success: false,
                message: 'Only doctors can add notes to appointments'
            });
        }

        if (!notes || !notes.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Notes are required'
            });
        }

        // Find and update the appointment
        const appointment = await prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                doctorId: doctorId
            }
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found or not authorized'
            });
        }

        const updatedAppointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                notes: notes.trim(),
                updatedAt: new Date()
            }
        });

        console.log('✅ Notes added to appointment:', appointmentId);

        res.json({
            success: true,
            message: 'Notes added successfully',
            appointment: {
                id: updatedAppointment.id,
                notes: updatedAppointment.notes
            }
        });

    } catch (error) {
        console.error('❌ Error adding notes:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add notes',
            error: error.message
        });
    }
});

// ✅ GET /api/doctors/:id - Get doctor by ID (Public)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const doctor = await prisma.user.findFirst({
            where: {
                id: id,
                role: 'DOCTOR'
                // Removed isVerified requirement as requested
            }
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.json({
            success: true,
            doctor: {
                id: doctor.id,
                name: doctor.name,
                specialization: doctor.specialization || 'General Medicine',
                qualification: doctor.qualification || 'MBBS',
                experience: doctor.experience || 5,
                rating: doctor.rating || 4.5,
                reviewCount: doctor.reviewCount || 0,
                consultationFee: doctor.consultationFee || 1000,
                location: doctor.location || 'Mumbai',
                image: doctor.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=3b82f6&color=fff&size=200`,
                about: doctor.about || 'Experienced medical practitioner.'
            }
        });
    } catch (error) {
        console.error('❌ Error in GET /doctors/:id:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctor'
        });
    }
});

module.exports = router;
