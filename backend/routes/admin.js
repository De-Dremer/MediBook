const express = require('express');
const {
    getDashboardStats,
    getAllUsers,
    getPendingDoctors,
    updateDoctorStatus,
    toggleUserStatus,
    getAllAppointments,
    getSystemSettings
} = require('../controllers/adminController');
const { authUser, authorize } = require('../middleware/auth');

const router = express.Router();

// Check if user is admin middleware
const authAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin role required.'
        });
    }
    next();
};

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', authUser, authAdmin, getDashboardStats);

// @route   GET /api/admin/users
// @desc    Get all users with filtering and pagination
// @access  Private (Admin only)
router.get('/users', authUser, authAdmin, getAllUsers);

// @route   PUT /api/admin/users/:id/toggle-status
// @desc    Activate/deactivate user account
// @access  Private (Admin only)
router.put('/users/:id/toggle-status', authUser, authAdmin, toggleUserStatus);

// @route   GET /api/admin/doctors/pending
// @desc    Get pending doctors for approval
// @access  Private (Admin only)
router.get('/doctors/pending', authUser, authAdmin, getPendingDoctors);

// @route   PUT /api/admin/doctors/:id/status
// @desc    Approve or reject doctor
// @access  Private (Admin only)
router.put('/doctors/:id/status', authUser, authAdmin, updateDoctorStatus);

// @route   GET /api/admin/appointments
// @desc    Get all appointments with filtering
// @access  Private (Admin only)
router.get('/appointments', authUser, authAdmin, getAllAppointments);

// @route   GET /api/admin/settings
// @desc    Get system settings
// @access  Private (Admin only)
router.get('/settings', authUser, authAdmin, getSystemSettings);

module.exports = router;
