const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

// We will initialize the client inside the handler or use a getter to ensure env vars are ready
const getGoogleClient = () => new OAuth2Client(process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID);

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'USER'
    });

    if (user) {
        return res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    }

    return res.status(400).json({ message: 'Invalid user data' });
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);

    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
        console.log(`Login failed: User with email ${email} not found.`);
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        console.log(`Login successful for user: ${user.name} (${user.email})`);
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        console.log(`Login failed: Incorrect password for email ${email}.`);
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

// @desc    Authenticate/Register user via Google OAuth
// @route   POST /api/auth/google
// @access  Public
const googleLoginUser = async (req, res) => {
    const { token } = req.body;
    console.log('--- Google Login Request Initialized ---');
    console.log(`Token received: ${token ? 'Yes (starts with ' + token.substring(0, 10) + '...)' : 'No'}`);

    if (!token) {
        console.error('Error: No Google token provided in request body');
        return res.status(400).json({ message: 'No Google token provided' });
    }

    try {
        const client = getGoogleClient();
        const googleIdKey = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;

        console.log(`Verifying Google token with clientID: ${googleIdKey}`);

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: googleIdKey
        });

        const payload = ticket.getPayload();
        console.log('Google Token Verified Successfully.');
        console.log(`User Info from Google: ${payload.email} (${payload.name})`);

        const { sub: googleId, email, name } = payload;

        // 1. Check if user already exists by googleId
        let user = await User.findOne({ googleId });
        console.log(`User lookup by googleId: ${user ? 'Found' : 'Not Found'}`);

        if (!user) {
            // 2. Check if user exists by email (registered normally first)
            user = await User.findOne({ email });
            console.log(`User lookup by email: ${user ? 'Found' : 'Not Found'}`);

            if (user) {
                console.log(`Linking existing email account to googleId: ${googleId}`);
                user.googleId = googleId;
                await user.save();
            } else {
                console.log(`Creating new user for: ${email}`);
                // 3. Create a completely new user
                const salt = await bcrypt.genSalt(10);
                const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-10) + Date.now(), salt);

                user = await User.create({
                    name,
                    email,
                    googleId,
                    role: 'USER',
                    password: randomPassword // Dummy secure password since they login via Google
                });
                console.log('New user created successfully.');
            }
        }

        console.log(`Login successful for user: ${user.name}`);

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error('CRITICAL: Google Auth Error:', error.message);
        if (error.message.includes('audience')) {
            console.error('HINT: Your Client ID in .env might not match the one used in the frontend.');
        }
        res.status(401).json({ message: `Google Authentication failed: ${error.message}` });
    }
};

module.exports = {
    registerUser,
    loginUser,
    googleLoginUser
};
