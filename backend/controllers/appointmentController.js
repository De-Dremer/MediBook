const prisma = require('../config/prisma');

// Generate unique appointment ID
const generateAppointmentId = () => {
    return `APT${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

// Book a new appointment
const bookAppointment = async (req, res) => {
    try {
        const { doctorId, appointmentDate, appointmentTime, symptoms, consultationType } = req.body;
        const patientId = req.user.id;

        // Validate doctor exists and is approved
        const doctor = await prisma.doctor.findUnique({
            where: { id: parseInt(doctorId) }
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        if (!doctor.isApproved) {
            return res.status(400).json({
                success: false,
                message: 'Doctor is not approved yet'
            });
        }

        if (!doctor.isAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Doctor is currently not available'
            });
        }

        // Check if appointment date is in the future
        const appointmentDateTime = new Date(appointmentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (appointmentDateTime < today) {
            return res.status(400).json({
                success: false,
                message: 'Cannot book appointment for past dates'
            });
        }

        // Check if the time slot is available
        const dateString = appointmentDateTime.toISOString().split('T')[0];
        const dayOfWeek = appointmentDateTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        // Check if doctor works on this day
        const availableSlots = doctor.availableSlots || {};
        const daySlots = availableSlots[dayOfWeek] || [];

        if (daySlots.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Doctor is not available on this day'
            });
        }

        // Check if the requested time falls within doctor's working hours
        const requestedTime = appointmentTime;
        let isValidTime = false;

        for (const slot of daySlots) {
            if (requestedTime >= slot.startTime && requestedTime < slot.endTime) {
                isValidTime = true;
                break;
            }
        }

        if (!isValidTime) {
            return res.status(400).json({
                success: false,
                message: 'Requested time is outside doctor\'s working hours'
            });
        }

        // Check if slot is already booked
        const bookedSlots = doctor.bookedSlots || {};
        const dateBookedSlots = bookedSlots[dateString] || [];

        if (dateBookedSlots.includes(requestedTime)) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked'
            });
        }

        // Check if patient already has an appointment with this doctor on the same day
        const startOfDay = new Date(appointmentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(appointmentDate);
        endOfDay.setHours(23, 59, 59, 999);

        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                patientId,
                doctorId: parseInt(doctorId),
                appointmentDate: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: {
                    in: ['PENDING', 'CONFIRMED']
                }
            }
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'You already have an appointment with this doctor on this date'
            });
        }

        // Create appointment
        const appointment = await prisma.appointment.create({
            data: {
                appointmentId: generateAppointmentId(),
                patientId,
                doctorId: parseInt(doctorId),
                appointmentDate: new Date(appointmentDate),
                appointmentTime,
                symptoms: symptoms || '',
                consultationType: consultationType?.toUpperCase() || 'IN_PERSON',
                consultationFee: doctor.consultationFee,
                status: 'PENDING'
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                doctor: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                                profileImage: true
                            }
                        }
                    }
                }
            }
        });

        // Update doctor's booked slots
        const updatedBookedSlots = {
            ...bookedSlots,
            [dateString]: [...dateBookedSlots, requestedTime]
        };

        await prisma.doctor.update({
            where: { id: parseInt(doctorId) },
            data: {
                bookedSlots: updatedBookedSlots
            }
        });

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            appointment
        });

    } catch (error) {
        console.error('Book appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to book appointment',
            error: error.message
        });
    }
};

// Get patient's appointments
const getMyAppointments = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const patientId = req.user.id;

        let where = { patientId };
        if (status && status !== 'all') {
            where.status = status.toUpperCase();
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                doctor: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                                profileImage: true
                            }
                        }
                    },
                    select: {
                        id: true,
                        specialization: true,
                        qualification: true,
                        consultationFee: true,
                        clinicAddress: true,
                        user: true
                    }
                }
            },
            orderBy: [
                { appointmentDate: 'desc' },
                { appointmentTime: 'desc' }
            ],
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit)
        });

        const total = await prisma.appointment.count({ where });

        res.json({
            success: true,
            count: appointments.length,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            appointments
        });

    } catch (error) {
        console.error('Get my appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments',
            error: error.message
        });
    }
};

// Get doctor's appointments
const getDoctorAppointments = async (req, res) => {
    try {
        const { status, date, page = 1, limit = 10 } = req.query;

        // Find doctor profile
        const doctor = await prisma.doctor.findUnique({
            where: { userId: req.user.id }
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found'
            });
        }

        let where = { doctorId: doctor.id };

        if (status && status !== 'all') {
            where.status = status.toUpperCase();
        }

        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            where.appointmentDate = {
                gte: startDate,
                lte: endDate
            };
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        dateOfBirth: true,
                        gender: true,
                        address: true,
                        profileImage: true
                    }
                }
            },
            orderBy: [
                { appointmentDate: 'asc' },
                { appointmentTime: 'asc' }
            ],
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit)
        });

        const total = await prisma.appointment.count({ where });

        res.json({
            success: true,
            count: appointments.length,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            appointments
        });

    } catch (error) {
        console.error('Get doctor appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments',
            error: error.message
        });
    }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const userId = req.user.id;

        // Valid status transitions
        const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
        if (!validStatuses.includes(status.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid appointment status'
            });
        }

        const appointment = await prisma.appointment.findUnique({
            where: { id: parseInt(id) },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                doctor: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check authorization
        const doctor = await prisma.doctor.findUnique({
            where: { userId }
        });

        const isDoctor = doctor && appointment.doctorId === doctor.id;
        const isPatient = appointment.patientId === userId;

        if (!isDoctor && !isPatient) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this appointment'
            });
        }

        // Business logic for status transitions
        if (status.toUpperCase() === 'CONFIRMED' && !isDoctor) {
            return res.status(403).json({
                success: false,
                message: 'Only doctors can confirm appointments'
            });
        }

        if (status.toUpperCase() === 'COMPLETED' && !isDoctor) {
            return res.status(403).json({
                success: false,
                message: 'Only doctors can mark appointments as completed'
            });
        }

        // Prepare update data
        let updateData = {
            status: status.toUpperCase()
        };

        // Handle notes
        if (notes) {
            const currentNotes = appointment.notes || {};
            if (isDoctor) {
                updateData.notes = {
                    ...currentNotes,
                    doctorNotes: notes
                };
            } else {
                updateData.notes = {
                    ...currentNotes,
                    patientNotes: notes
                };
            }
        }

        // Handle cancellation
        if (status.toUpperCase() === 'CANCELLED') {
            updateData.cancelledBy = userId;
            updateData.cancelledAt = new Date();
            if (notes) {
                updateData.cancellationReason = notes;
            }

            // Free up the time slot
            const dateString = appointment.appointmentDate.toISOString().split('T')[0];
            const doctorProfile = await prisma.doctor.findUnique({
                where: { id: appointment.doctorId }
            });

            if (doctorProfile) {
                const bookedSlots = doctorProfile.bookedSlots || {};
                const dateSlots = bookedSlots[dateString] || [];
                const updatedSlots = dateSlots.filter(slot => slot !== appointment.appointmentTime);

                await prisma.doctor.update({
                    where: { id: appointment.doctorId },
                    data: {
                        bookedSlots: {
                            ...bookedSlots,
                            [dateString]: updatedSlots
                        }
                    }
                });
            }
        }

        // Update appointment
        const updatedAppointment = await prisma.appointment.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                doctor: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        res.json({
            success: true,
            message: `Appointment ${status.toLowerCase()} successfully`,
            appointment: updatedAppointment
        });

    } catch (error) {
        console.error('Update appointment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update appointment status',
            error: error.message
        });
    }
};

// Get single appointment details
const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const appointment = await prisma.appointment.findUnique({
            where: { id: parseInt(id) },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        dateOfBirth: true,
                        gender: true,
                        address: true,
                        profileImage: true
                    }
                },
                doctor: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                                profileImage: true
                            }
                        }
                    },
                    select: {
                        id: true,
                        specialization: true,
                        qualification: true,
                        experience: true,
                        consultationFee: true,
                        clinicAddress: true,
                        user: true
                    }
                }
            }
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check authorization
        const doctor = await prisma.doctor.findUnique({
            where: { userId }
        });

        const isDoctor = doctor && appointment.doctorId === doctor.id;
        const isPatient = appointment.patientId === userId;

        if (!isDoctor && !isPatient) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view this appointment'
            });
        }

        res.json({
            success: true,
            appointment
        });

    } catch (error) {
        console.error('Get appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointment',
            error: error.message
        });
    }
};

// Add prescription to appointment
const addPrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { medicines, generalInstructions, nextFollowUp } = req.body;

        // Check if user is a doctor
        const doctor = await prisma.doctor.findUnique({
            where: { userId: req.user.id }
        });

        if (!doctor) {
            return res.status(403).json({
                success: false,
                message: 'Only doctors can add prescriptions'
            });
        }

        const appointment = await prisma.appointment.findUnique({
            where: { id: parseInt(id) }
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check if this is doctor's appointment
        if (appointment.doctorId !== doctor.id) {
            return res.status(403).json({
                success: false,
                message: 'You can only add prescriptions to your own appointments'
            });
        }

        // Check if appointment is completed
        if (appointment.status !== 'COMPLETED') {
            return res.status(400).json({
                success: false,
                message: 'Prescriptions can only be added to completed appointments'
            });
        }

        // Update prescription
        const updatedAppointment = await prisma.appointment.update({
            where: { id: parseInt(id) },
            data: {
                prescription: {
                    medicines: medicines || [],
                    generalInstructions: generalInstructions || '',
                    nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : null
                }
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                doctor: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'Prescription added successfully',
            appointment: updatedAppointment
        });

    } catch (error) {
        console.error('Add prescription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add prescription',
            error: error.message
        });
    }
};

module.exports = {
    bookAppointment,
    getMyAppointments,
    getDoctorAppointments,
    updateAppointmentStatus,
    getAppointmentById,
    addPrescription
};
