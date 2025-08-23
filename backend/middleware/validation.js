const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// User registration validation
const validateUserRegistration = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),

    body('password')
        .isLength({ min: 6, max: 128 })
        .withMessage('Password must be at least 6 characters long'),

    body('phone')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),

    body('role')
        .optional()
        .isIn(['patient', 'doctor', 'admin'])
        .withMessage('Role must be patient, doctor, or admin'),

    handleValidationErrors
];

// User login validation
const validateUserLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    handleValidationErrors
];

// Doctor profile validation
const validateDoctorProfile = [
    body('specialization')
        .optional()
        .isIn(['GENERAL_MEDICINE', 'CARDIOLOGY', 'DERMATOLOGY', 'PEDIATRICS', 'GYNECOLOGY', 'ORTHOPEDICS', 'NEUROLOGY', 'PSYCHIATRY', 'OPHTHALMOLOGY', 'ENT', 'DENTISTRY', 'PHYSIOTHERAPY', 'OTHER'])
        .withMessage('Invalid specialization'),

    body('qualification')
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Qualification must be between 2 and 200 characters'),

    body('experience')
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage('Experience must be a number between 0 and 50'),

    body('consultationFee')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Consultation fee must be a positive number'),

    handleValidationErrors
];

// Appointment booking validation  
const validateAppointmentBooking = [
    body('doctorId')
        .isInt({ min: 1 })
        .withMessage('Invalid doctor ID'),

    body('appointmentDate')
        .isISO8601()
        .toDate()
        .custom((date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (date < today) {
                throw new Error('Appointment date cannot be in the past');
            }

            const maxDate = new Date();
            maxDate.setDate(maxDate.getDate() + 90); // Allow booking up to 90 days in advance
            if (date > maxDate) {
                throw new Error('Appointment date cannot be more than 90 days in advance');
            }

            return true;
        }),

    body('appointmentTime')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Please provide a valid time in HH:MM format'),

    body('symptoms')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Symptoms description cannot exceed 500 characters'),

    body('consultationType')
        .optional()
        .isIn(['in-person', 'video-call', 'phone-call'])
        .withMessage('Invalid consultation type'),

    handleValidationErrors
];

// Appointment status update validation
const validateAppointmentStatusUpdate = [
    body('status')
        .isIn(['pending', 'confirmed', 'completed', 'cancelled', 'no-show'])
        .withMessage('Invalid appointment status'),

    body('notes')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Notes cannot exceed 1000 characters'),

    handleValidationErrors
];

// Prescription validation
const validatePrescription = [
    body('medicines')
        .optional()
        .isArray()
        .withMessage('Medicines must be an array'),

    body('medicines.*.name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Medicine name must be between 1 and 200 characters'),

    body('medicines.*.dosage')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Dosage cannot exceed 100 characters'),

    body('generalInstructions')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('General instructions cannot exceed 1000 characters'),

    body('nextFollowUp')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Invalid follow-up date'),

    handleValidationErrors
];

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateDoctorProfile,
    validateAppointmentBooking,
    validateAppointmentStatusUpdate,
    validatePrescription,
    handleValidationErrors
};
