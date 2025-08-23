const express = require('express');
const {
    bookAppointment,
    getMyAppointments,
    getDoctorAppointments,
    updateAppointmentStatus,
    getAppointmentById,
    addPrescription
} = require('../controllers/appointmentController');
const { authUser, authDoctor } = require('../middleware/auth');
const {
    validateAppointmentBooking,
    validateAppointmentStatusUpdate,
    validatePrescription
} = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/appointments
// @desc    Book a new appointment
// @access  Private (Patient)
router.post('/', authUser, validateAppointmentBooking, bookAppointment);

// @route   GET /api/appointments/my
// @desc    Get current user's appointments (patient view)
// @access  Private
router.get('/my', authUser, getMyAppointments);

// @route   GET /api/appointments/doctor/my
// @desc    Get current doctor's appointments
// @access  Private (Doctor only)
router.get('/doctor/my', authDoctor, getDoctorAppointments);

// @route   GET /api/appointments/:id
// @desc    Get single appointment details
// @access  Private (Patient or Doctor involved in the appointment)
router.get('/:id', authUser, getAppointmentById);

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status
// @access  Private (Patient or Doctor involved in the appointment)
router.put('/:id/status', authUser, validateAppointmentStatusUpdate, updateAppointmentStatus);

// @route   PUT /api/appointments/:id/prescription
// @desc    Add prescription to appointment
// @access  Private (Doctor only)
router.put('/:id/prescription', authDoctor, validatePrescription, addPrescription);

module.exports = router;
