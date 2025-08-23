const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role, dateOfBirth, gender } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                role: role ? role.toUpperCase() : 'PATIENT',
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                gender: gender ? gender.toUpperCase() : null
            }
        });

        // If registering as doctor, create doctor profile
        if (role && role.toLowerCase() === 'doctor') {
            await prisma.doctor.create({
                data: {
                    userId: user.id,
                    specialization: 'GENERAL_MEDICINE',
                    qualification: 'To be updated',
                    experience: 0,
                    consultationFee: 500,
                    isApproved: false
                }
            });
        }

        // Generate token
        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role.toLowerCase(),
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

// Login user - FIXED VERSION
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user with prisma (NOT mongoose User model)
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        // Generate token
        const token = generateToken(user.id);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role.toLowerCase(),
                profileImage: user.profileImage,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

// Get current user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                dateOfBirth: true,
                gender: true,
                role: true,
                profileImage: true,
                address: true,
                isVerified: true,
                createdAt: true,
                doctorProfile: {
                    select: {
                        id: true,
                        specialization: true,
                        qualification: true,
                        experience: true,
                        consultationFee: true,
                        isApproved: true,
                        isAvailable: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                ...user,
                role: user.role.toLowerCase(),
                gender: user.gender?.toLowerCase()
            },
            doctorProfile: user.doctorProfile
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user profile',
            error: error.message
        });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const { name, phone, dateOfBirth, gender, address } = req.body;

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                name,
                phone,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                gender: gender ? gender.toUpperCase() : undefined,
                address
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                dateOfBirth: true,
                gender: true,
                role: true,
                address: true,
                profileImage: true,
                isVerified: true
            }
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                ...user,
                role: user.role.toLowerCase(),
                gender: user.gender?.toLowerCase()
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
};
