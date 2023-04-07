const router = require('express').Router();
const { isGuest, isAuthorized, isAuth } = require('../middlewares/guards');
const {
    register,
    login,
    logout,
    getAll,
    authorize,
    update,
} = require('../services/users');
const mapErrors = require('../utils/mapper');

router.get('/', isAuthorized(), async (req, res) => {
    const data = await getAll();
    res.json(data);
});

router.post('/authorize/:id', isAuthorized(), async (req, res) => {
    const data = await authorize(req.params.id);
    res.json(data);
});

router.post('/register', isGuest(), async (req, res) => {
    try {
        if (
            req.body.password.trim() == '' ||
            req.body.email.trim() == '' ||
            req.body.name.trim() == '' ||
            req.body.phoneNumber.trim() == ''
        ) {
            throw new Error('All fields are required');
        }

        const result = await register(
            req.body.email.trim().toLowerCase(),
            req.body.name.trim(),
            req.body.phoneNumber.trim(),
            req.body.password.trim()
        );
        res.status(201).json(result);
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error });
    }
});

router.post('/login', isGuest(), async (req, res) => {
    try {
        if (req.body.password.trim() == '' || req.body.email.trim() == '') {
            throw new Error('Email and password are required');
        }
        const result = await login(
            req.body.email.trim().toLowerCase(),
            req.body.password.trim()
        );
        res.json(result);
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error });
    }
});

router.get('/logout', (req, res) => {
    logout(req.user?.token);
    res.status(204).end();
});

router.put('/:id', isAuth(), async (req, res) => {
    const userId = req.params.id;
    try {
        if (
            req.body.password.trim() == '' ||
            req.body.email.trim() == '' ||
            req.body.name.trim() == '' ||
            req.body.phoneNumber.trim() == ''
        ) {
            throw new Error('All fields are required');
        }
        const updatedUser = {
            email: req.body.email,
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
        };
        const result = await update(userId, updatedUser);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error });
    }
});

module.exports = router;
