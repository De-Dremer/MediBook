const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create sample doctors
    const doctors = [
        {
            name: 'Dr. Sarah Wilson',
            email: 'sarah.wilson@hospital.com',
            password: hashedPassword,
            phone: '+91-9876543210',
            role: 'DOCTOR',
            isVerified: true,
            specialization: 'Cardiology',
            qualification: 'MBBS, MD Cardiology',
            experience: 12,
            consultationFee: 1500,
            location: 'Mumbai',
            about: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
            rating: 4.8,
            reviewCount: 245
        },
        {
            name: 'Dr. Michael Chen',
            email: 'michael.chen@hospital.com',
            password: hashedPassword,
            phone: '+91-9876543211',
            role: 'DOCTOR',
            isVerified: true,
            specialization: 'Dermatology',
            qualification: 'MBBS, MD Dermatology',
            experience: 8,
            consultationFee: 1200,
            location: 'Delhi',
            about: 'Skin specialist with expertise in cosmetic and medical dermatology.',
            rating: 4.7,
            reviewCount: 189
        },
        {
            name: 'Dr. Emily Brown',
            email: 'emily.brown@hospital.com',
            password: hashedPassword,
            phone: '+91-9876543212',
            role: 'DOCTOR',
            isVerified: true,
            specialization: 'General Medicine',
            qualification: 'MBBS, MD Internal Medicine',
            experience: 15,
            consultationFee: 1000,
            location: 'Bangalore',
            about: 'General physician with extensive experience in preventive healthcare.',
            rating: 4.9,
            reviewCount: 320
        }
    ];

    // Create doctors
    for (const doctorData of doctors) {
        const doctor = await prisma.user.upsert({
            where: { email: doctorData.email },
            update: {},
            create: doctorData
        });
        console.log('👨‍⚕️ Created doctor:', doctor.name);
    }

    // Create admin user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@medibook.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@medibook.com',
            password: hashedPassword,
            phone: '+91-9999999999',
            role: 'ADMIN',
            isVerified: true
        }
    });
    console.log('👑 Created admin:', admin.name);

    // Create sample patient
    const patient = await prisma.user.upsert({
        where: { email: 'patient@medibook.com' },
        update: {},
        create: {
            name: 'Test Patient',
            email: 'patient@medibook.com',
            password: hashedPassword,
            phone: '+91-8888888888',
            role: 'PATIENT',
            isVerified: true,
            dateOfBirth: new Date('1990-01-15'),
            gender: 'MALE',
            address: '123 Patient Street, Mumbai, Maharashtra 400001',
            bloodGroup: 'O+'
        }
    });
    console.log('👤 Created patient:', patient.name);

    console.log('✅ Database seeding completed!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Seeding error:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
