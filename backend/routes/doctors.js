const express = require('express');
const {
    getAllDoctors,
    getDoctorById,
    getMyDoctorProfile,
    updateDoctorProfile,
    getDoctorAvailableSlots
} = require('../controllers/doctorController');
const { authUser, authDoctor } = require('../middleware/auth');
const { validateDoctorProfile } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/doctors
// @desc    Get all approved doctors
// @access  Public
router.get('/', getAllDoctors);

// @route   GET /api/doctors/my/profile
// @desc    Get current doctor's profile
// @access  Private (Doctor only)
router.get('/my/profile', authDoctor, getMyDoctorProfile);

// @route   PUT /api/doctors/profile
// @desc    Update doctor profile
// @access  Private (Doctor only)
router.put('/profile', authDoctor, validateDoctorProfile, updateDoctorProfile);

// @route   GET /api/doctors/:id
// @desc    Get doctor by ID
// @access  Public
router.get('/:id', getDoctorById);

// @route   GET /api/doctors/:id/available-slots/:date
// @desc    Get available slots for a doctor on specific date
// @access  Public
router.get('/:id/available-slots/:date', getDoctorAvailableSlots);

module.exports = router;
