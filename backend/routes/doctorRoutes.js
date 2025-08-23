const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Define controller functions directly in the route file
const getAllDoctors = async (req, res) => {
    try {
        console.log('📥 GET /doctors called');
        const { search, specialization, location } = req.query;

        const where = {
            role: 'DOCTOR',
            isVerified: true
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
            image: doctor.profileImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
            about: doctor.about || `Experienced ${doctor.specialization || 'General Medicine'} practitioner.`
        }));

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
};

const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;

        const doctor = await prisma.user.findFirst({
            where: {
                id: id,
                role: 'DOCTOR',
                isVerified: true
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
                image: doctor.profileImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
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
};

// ✅ Define routes with inline functions
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

module.exports = router;
