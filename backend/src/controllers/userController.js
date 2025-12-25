const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper: Create JWT
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

// @route   GET /api/users
const getAllUsers = async (req, res) => {
    try {
        // fetch all users, omit their password
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, age, gender, email, phone, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            age,
            gender,
            email,
            phone,
            password: hashedPassword,
            role
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            token: generateToken(newUser._id),
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   PUT /api/auth/users/:id
const updateUser = async (req, res) => {
    try {
        // Check permissions: Owner or Admin/Receptionist
        if (req.user.id !== req.params.id && req.user.role === 'patient') { // Assuming verifyToken sets req.user (which it does, but verifyToken sets {id}, need to verify role from DB or token?)
            // verifyToken only sets {id}, so req.user.role might be undefined if we don't fetch user.
            // However, loginUser signs token with { id: userId }.
            // So req.user only has id.
        }

        // BETTER APPROACH: Fetch user first or fetch role if not in token.
        // But let's assume valid access for now or rely on the fact that patients can't guess IDs easily? 
        // No, security risk.
        // Let's rely on middleware to populate req.user fully if needed, or fetch it here.
        // Wait, verifyToken only does jwt.verify.
        // I need to fetch the user properties to check role, or trust that the route protection handles it.
        // But for "User updating themselves", I know req.user.id.

        if (req.user.id !== req.params.id) {
            // If trying to update someone else, must be admin/receptionist.
            // Accessing DB to check role is expensive but necessary if token doesn't have role.
            const requestor = await User.findById(req.user.id);
            if (!['admin', 'receptionist'].includes(requestor.role)) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        const updated = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');  // omit password field
        if (!updated) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   DELETE /api/auth/users/:id
const deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { emailPhone, password } = req.body;

    if (!emailPhone || !password) {
        return res.status(400).json({ message: 'Please provide email/phone and password' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email: emailPhone }) || await User.findOne({ phone: emailPhone });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email/phone or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email/phone or password' });
        }

        // Set cookie options
        const cookieOptions = {
            httpOnly: true,
            secure: false, // development
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        };

        // Send token in cookie during login
        const token = generateToken(user._id);
        res.cookie('token', token, cookieOptions).status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/auth/users/:id/history
const getUserHistory = async (req, res) => {
    try {
        // Ensure user is requesting their own history or is admin
        if (req.user.id !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Fetch user history from User schema (if stored there) or Appointments
        const Appointment = require('../models/Appointment');
        const appointments = await Appointment.find({ patientId: req.params.id })
            .populate('treatments.treatmentId')
            .sort({ appointmentDate: -1 });

        res.status(200).json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserProfile,
    getUserHistory
};
