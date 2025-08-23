const bcrypt = require('bcryptjs');
const prisma = require('./config/prisma');

const createAdmin = async () => {
    try {
        console.log('🚀 Creating admin user...');

        // Check if admin already exists
        const existingAdmin = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });

        if (existingAdmin) {
            console.log('✅ Admin user already exists:', existingAdmin.email);
            console.log('📧 Email:', existingAdmin.email);
            console.log('🎯 Role:', existingAdmin.role);
            return;
        }

        // Create admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin123!', salt);

        const admin = await prisma.user.create({
            data: {
                name: 'System Administrator',
                email: 'admin@medibook.com',
                password: hashedPassword,
                phone: '9999999999',
                role: 'ADMIN',
                isActive: true,
                isVerified: true
            }
        });

        console.log('✅ Admin user created successfully!');
        console.log('👤 Name:', admin.name);
        console.log('📧 Email:', admin.email);
        console.log('🔑 Password: Admin123!');
        console.log('📱 Phone:', admin.phone);
        console.log('🎯 Role:', admin.role);
        console.log('✅ Active:', admin.isActive);
        console.log('✅ Verified:', admin.isVerified);

    } catch (error) {
        console.error('❌ Error creating admin:', error.message);

        // Handle specific errors
        if (error.code === 'P2002') {
            console.log('⚠️  Admin with this email already exists');
        } else {
            console.error('Full error:', error);
        }
    } finally {
        await prisma.$disconnect();
        console.log('📝 Database connection closed');
    }
};

// Run the function
createAdmin();
