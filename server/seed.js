const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hms_db');
        console.log('MongoDB Connected for Seeding');

        await User.deleteMany({}); // Clear existing users

        const hashedPassword = await bcrypt.hash('password123', 10);

        const users = [
            {
                username: 'admin',
                password: hashedPassword,
                role: 'admin',
                name: 'System Admin'
            },
            {
                username: 'doctor',
                password: hashedPassword,
                role: 'doctor',
                name: 'Dr. Smith'
            },
            {
                username: 'staff',
                password: hashedPassword,
                role: 'staff',
                name: 'John Staff'
            }
        ];

        await User.insertMany(users);
        console.log('Database Seeded Successfully');
        console.log('Default Password: password123');
        process.exit();
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedUsers();
