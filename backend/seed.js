const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./src/models/User');
const Appointment = require('./src/models/Appointment');
const Treatment = require('./src/models/Treatment');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });
// Fallback if that path fails, try root
if (!process.env.MONGO_URI) {
    dotenv.config({ path: path.join(__dirname, '../.env') });
}

console.log('Connecting to:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Appointment.deleteMany({});
        await Treatment.deleteMany({});

        console.log('Data Cleared');

        // 1. Create Treatments
        const treatments = await Treatment.insertMany([
            { name: 'Root Canal', description: 'Deep cleaning and filling of the root canal.', price: 500, priceRange: '400-600', discountAvailable: false },
            { name: 'Teeth Whitening', description: 'Professional teeth whitening service.', price: 200, priceRange: '150-250', discountAvailable: true },
            { name: 'Dental Implant', description: 'Surgical placement of a dental implant.', price: 1200, priceRange: '1000-1500', discountAvailable: false },
            { name: 'Braces', description: 'Orthodontic treatment for teeth alignment.', price: 3000, priceRange: '2500-3500', discountAvailable: true },
            { name: 'General Checkup', description: 'Routine dental examination and cleaning.', price: 50, priceRange: '40-70', discountAvailable: false }
        ]);

        console.log('Treatments Seeded');

        // 2. Create Users (Patients, Admin, Receptionist)
        const passwordHash = await bcrypt.hash('password123', 10);

        const users = await User.insertMany([
            { name: 'John Doe', age: 30, gender: 'Male', email: 'john@example.com', phone: '1234567890', password: passwordHash, role: 'patient' },
            { name: 'Jane Smith', age: 25, gender: 'Female', email: 'jane@example.com', phone: '0987654321', password: passwordHash, role: 'patient' },
            { name: 'Admin User', age: 40, gender: 'Male', email: 'admin@clinic.com', phone: '1112223333', password: passwordHash, role: 'admin' },
            { name: 'Receptionist User', age: 35, gender: 'Female', email: 'reception@clinic.com', phone: '4445556666', password: passwordHash, role: 'receptionist' }
        ]);

        console.log('Users Seeded');

        // 3. Create Appointments
        const appointments = await Appointment.insertMany([
            {
                patientName: users[0].name,
                phone: users[0].phone,
                age: users[0].age,
                gender: users[0].gender,
                patientId: users[0]._id,
                status: 'pending',
                appointmentDate: new Date(Date.now() + 86400000), // Tomorrow
                symptoms: 'Toothache in upper left molar',
                treatments: []
            },
            {
                patientName: users[1].name,
                phone: users[1].phone,
                age: users[1].age,
                gender: users[1].gender,
                patientId: users[1]._id,
                status: 'confirmed',
                appointmentDate: new Date(Date.now() + 172800000), // Day after tomorrow
                symptoms: 'Sensitivity to cold',
                treatments: [{ treatmentId: treatments[1]._id }],
                doctor: 'Dr. Aezal'
            },
            {
                patientName: users[0].name,
                phone: users[0].phone,
                age: users[0].age,
                gender: users[0].gender,
                patientId: users[0]._id,
                status: 'completed',
                appointmentDate: new Date(Date.now() - 86400000), // Yesterday
                symptoms: 'Regular checkup',
                treatments: [{ treatmentId: treatments[4]._id }],
                doctor: 'Dr. Aezal',
                prescription: 'Brush twice daily, floss regularly.'
            }
        ]);

        console.log('Appointments Seeded');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
