const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');


const JWT_SECRET = 'asoiducan93284c9rew';
const blacklist = [];

async function register(email, name, phoneNumber, password) {
    const existing = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

    if (existing) {
        throw new Error('Email already exists');
    }

    const user = new User({
        email,
        name,
        phoneNumber,
        hashedPassword: await bcrypt.hash(password, 10)
    });

    await user.save();

    return createSession(user);
}

async function login(email, password) {
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    if (!user) {
        throw new Error('Incorrect email or password');
    }

    const match = await bcrypt.compare(password, user.hashedPassword);

    if (!match) {
        throw new Error('Incorrect email or password');
    }

    return createSession(user);
}

function logout(token) {
    blacklist.push(token);
}

function createSession(user) {
    return {
        email: user.email,
        fullName: user.name,
        phoneNumber: user.phoneNumber,
        autorization: user.autorization,
        _id: user._id,
        accessToken: jwt.sign({
            email: user.email,
            autorization: user.autorization,
            _id: user._id
        }, JWT_SECRET)
    };
}

function verifySession(token) {
    if (blacklist.includes(token)) {
        throw new Error('Token is invalidated');
    }
    
    const payload = jwt.verify(token, JWT_SECRET);
    
    return {
        email: payload.email,
        autorization: payload.autorization,
        _id: payload._id,
        token
    };
}

function getAll() {
    return User.find({}).select('-hashedPassword');
}

async function authorize(id){
    const user = await User.findById(id)
    if(user.autorization === 'User'){
        user.autorization = 'Admin'
    }else{
        user.autorization = 'User'
    }
    await user.save()
    return user;
}

module.exports = {
    register,
    login,
    logout,
    verifySession,
    getAll,
    authorize
};