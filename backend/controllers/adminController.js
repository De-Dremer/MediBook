const prisma = require('../config/prisma');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // Get counts for different entities
        const [
            totalUsers,
            totalPatients,
            totalDoctors,
            approvedDoctors,
            pendingDoctors,
            totalAppointments,
            todayAppointments,
            completedAppointments,
            totalReviews
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'PATIENT' } }),
            prisma.doctor.count(),
            prisma.doctor.count({ where: { isApproved: true } }),
            prisma.doctor.count({ where: { isApproved: false } }),
            prisma.appointment.count(),
            prisma.appointment.count({
                where: {
                    appointmentDate: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lte: new Date(new Date().setHours(23, 59, 59, 999))
                    }
                }
            }),
            prisma.appointment.count({ where: { status: 'COMPLETED' } }),
            prisma.review.count()
        ]);

        // Get recent registrations (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentUsers = await prisma.user.count({
            where: { createdAt: { gte: sevenDaysAgo } }
        });

        // Get appointment status breakdown
        const appointmentsByStatus = await prisma.appointment.groupBy({
            by: ['status'],
            _count: { status: true }
        });

        // Get top-rated doctors
        const topDoctors = await prisma.doctor.findMany({
            where: {
                isApproved: true,
                totalReviews: { gt: 0 }
            },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { averageRating: 'desc' },
            take: 5
        });

        res.json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    patients: totalPatients,
                    doctors: totalDoctors,
                    recent: recentUsers
                },
                doctors: {
                    total: totalDoctors,
                    approved: approvedDoctors,
                    pending: pendingDoctors,
                    approvalRate: totalDoctors > 0 ? ((approvedDoctors / totalDoctors) * 100).toFixed(1) : 0
                },
                appointments: {
                    total: totalAppointments,
                    today: todayAppointments,
                    completed: completedAppointments,
                    completionRate: totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(1) : 0,
                    byStatus: appointmentsByStatus
                },
                reviews: {
                    total: totalReviews
                },
                topDoctors
            }
        });

    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
};

// Get all users with pagination and filtering
const getAllUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            role,
            status,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        let where = {};

        // Filter by role
        if (role && role !== 'all') {
            where.role = role.toUpperCase();
        }

        // Filter by status
        if (status === 'active') {
            where.isActive = true;
        } else if (status === 'inactive') {
            where.isActive = false;
        }

        // Search functionality
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } }
            ];
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
                isVerified: true,
                createdAt: true,
                lastLogin: true,
                doctorProfile: {
                    select: {
                        id: true,
                        specialization: true,
                        isApproved: true,
                        consultationFee: true
                    }
                }
            },
            orderBy: { [sortBy]: sortOrder },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit)
        });

        const total = await prisma.user.count({ where });

        res.json({
            success: true,
            count: users.length,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            users: users.map(user => ({
                ...user,
                role: user.role.toLowerCase()
            }))
        });

    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
};

// Get pending doctors for approval
const getPendingDoctors = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const pendingDoctors = await prisma.doctor.findMany({
            where: { isApproved: false },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        dateOfBirth: true,
                        createdAt: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit)
        });

        const total = await prisma.doctor.count({ where: { isApproved: false } });

        res.json({
            success: true,
            count: pendingDoctors.length,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            doctors: pendingDoctors
        });

    } catch (error) {
        console.error('Get pending doctors error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending doctors',
            error: error.message
        });
    }
};

// Approve or reject doctor
const updateDoctorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, reason } = req.body; // action: 'approve' | 'reject'

        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid action. Use "approve" or "reject"'
            });
        }

        const doctor = await prisma.doctor.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        if (action === 'approve') {
            await prisma.doctor.update({
                where: { id: parseInt(id) },
                data: {
                    isApproved: true,
                    isAvailable: true
                }
            });

            // TODO: Send approval email to doctor

            res.json({
                success: true,
                message: `Doctor ${doctor.user.name} has been approved successfully`,
                doctor
            });
        } else {
            // Reject doctor - you might want to delete the record or keep it with rejected status
            await prisma.doctor.update({
                where: { id: parseInt(id) },
                data: {
                    isApproved: false,
                    isAvailable: false
                    // You could add a rejectionReason field to store the reason
                }
            });

            // TODO: Send rejection email to doctor

            res.json({
                success: true,
                message: `Doctor ${doctor.user.name} has been rejected`,
                reason
            });
        }

    } catch (error) {
        console.error('Update doctor status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update doctor status',
            error: error.message
        });
    }
};

// Toggle user account status (activate/deactivate)
const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) || id }, // Handle both int and uuid
            select: { id: true, name: true, email: true, isActive: true, role: true }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from deactivating themselves
        if (user.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot deactivate your own account'
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { isActive: !user.isActive },
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                role: true
            }
        });

        res.json({
            success: true,
            message: `User ${updatedUser.name} has been ${updatedUser.isActive ? 'activated' : 'deactivated'}`,
            user: updatedUser
        });

    } catch (error) {
        console.error('Toggle user status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user status',
            error: error.message
        });
    }
};

// Get all appointments with filtering
const getAllAppointments = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            date,
            doctorId,
            patientId,
            sortBy = 'appointmentDate',
            sortOrder = 'desc'
        } = req.query;

        let where = {};

        // Filter by status
        if (status && status !== 'all') {
            where.status = status.toUpperCase();
        }

        // Filter by date
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

        // Filter by doctor
        if (doctorId) {
            where.doctorId = parseInt(doctorId);
        }

        // Filter by patient
        if (patientId) {
            where.patientId = patientId; // Handle both int and uuid
        }

        const appointments = await prisma.appointment.findMany({
            where,
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
                                phone: true
                            }
                        }
                    },
                    select: {
                        id: true,
                        specialization: true,
                        consultationFee: true,
                        user: true
                    }
                }
            },
            orderBy: { [sortBy]: sortOrder },
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
        console.error('Get all appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments',
            error: error.message
        });
    }
};

// System settings management
const getSystemSettings = async (req, res) => {
    try {
        // This would typically come from a settings table
        // For now, return some default settings
        const settings = {
            platform: {
                name: 'MediBook',
                version: '2.0.0',
                maintenanceMode: false
            },
            appointments: {
                maxBookingDays: 90,
                minBookingHours: 2,
                allowCancellation: true,
                cancellationHours: 24
            },
            doctors: {
                autoApproval: false,
                requireDocuments: true,
                maxConsultationFee: 10000
            },
            notifications: {
                emailEnabled: true,
                smsEnabled: false,
                appointmentReminders: true
            }
        };

        res.json({
            success: true,
            settings
        });

    } catch (error) {
        console.error('Get system settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch system settings',
            error: error.message
        });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    getPendingDoctors,
    updateDoctorStatus,
    toggleUserStatus,
    getAllAppointments,
    getSystemSettings
};
