const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./src/models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const user = await User.findOne({ email: 'admin@clinic.com' });
        console.log('Admin user found:', user ? user.email : 'NOT FOUND');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
