const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    email: { type: String, required: [true, 'Email is required'] },
    name: { type: String, required: [true, 'Name is required'] },
    phoneNumber: { type: String, required: [true, 'Phone number is required'] },
    autorization: { type: String, default: 'User' },
    hashedPassword: { type: String, required: true },
});

userSchema.index(
    { email: 1 },
    {
        collation: {
            locale: 'en',
            strength: 1,
        },
    }
);

const User = model('User', userSchema);

module.exports = User;
