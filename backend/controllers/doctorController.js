const { PrismaClient } = require('@prisma/client');

// ✅ Create Prisma client instance
const prisma = new PrismaClient();

// ✅ GET /api/doctors - Get all doctors
const getAllDoctors = async (req, res) => {
    try {
        console.log('📥 GET /doctors called');
        console.log('🔍 Query params:', req.query);

        const { search, specialization, location, limit = 20, offset = 0 } = req.query;

        // Build where clause for filtering
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
                availability: true,
                createdAt: true
            },
            take: parseInt(limit),
            skip: parseInt(offset),
            orderBy: { rating: 'desc' }
        });

        console.log('📊 Found doctors from DB:', doctors.length);

        // Format response to match frontend expectations
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
            image: doctor.profileImage || `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face`,
            about: doctor.about || `Experienced ${doctor.specialization || 'General Medicine'} practitioner with ${doctor.experience || 5}+ years of experience.`
        }));

        res.json({
            success: true,
            doctors: formattedDoctors,
            count: formattedDoctors.length,
            total: await prisma.user.count({ where })
        });
    } catch (error) {
        console.error('❌ Error in GET /doctors:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctors',
            error: error.message
        });
    }
};

// ✅ GET /api/doctors/:id - Get doctor by ID
const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('📥 GET /doctors/:id called with id:', id);

        const doctor = await prisma.user.findFirst({
            where: {
                id: id,
                role: 'DOCTOR',
                isVerified: true
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
                availability: true,
                createdAt: true
            }
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Format response
        const formattedDoctor = {
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
            image: doctor.profileImage || `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face`,
            about: doctor.about || `Experienced ${doctor.specialization || 'General Medicine'} practitioner.`,
            languages: ['English', 'Hindi'],
            awards: ['Excellence in Patient Care 2024'],
            education: [`${doctor.qualification || 'MBBS'} - Medical College`],
            availability: {
                Monday: ['9:00 AM - 1:00 PM', '3:00 PM - 6:00 PM'],
                Tuesday: ['9:00 AM - 1:00 PM', '3:00 PM - 6:00 PM'],
                Wednesday: ['9:00 AM - 1:00 PM'],
                Thursday: ['9:00 AM - 1:00 PM', '3:00 PM - 6:00 PM'],
                Friday: ['9:00 AM - 1:00 PM', '3:00 PM - 6:00 PM'],
                Saturday: ['9:00 AM - 2:00 PM'],
                Sunday: ['Closed']
            }
        };

        res.json({
            success: true,
            doctor: formattedDoctor
        });
    } catch (error) {
        console.error('❌ Error in GET /doctors/:id:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctor details',
            error: error.message
        });
    }
};

module.exports = {
    getAllDoctors,
    getDoctorById
};
