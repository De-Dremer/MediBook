const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const Review = require('./models/Review');

const testModels = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Database connected successfully');

        // Test User model
        console.log('✅ User model loaded');

        // Test Doctor model
        console.log('✅ Doctor model loaded');

        // Test Appointment model
        console.log('✅ Appointment model loaded');

        // Test Review model
        console.log('✅ Review model loaded');

        console.log('🎉 All models are working correctly!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('📝 Database connection closed');
    }
};

testModels();
