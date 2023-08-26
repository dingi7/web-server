const router = require('express').Router();
const api = require('../services/orders');
const mapErrors = require('../utils/mapper');
const { isAuthorized, isAuth } = require('../middlewares/guards');

router.get('/', isAuthorized(), async (req, res) => {
    const data = await api.getAll();
    if (data) {
        res.json(data)
    }
    else {
        res.end()
    }
});

router.get('/statistics', isAuthorized(), async (req, res) => {
    const data = await api.getOrderStatistics();
    res.json(data)
})

router.get('/user', isAuth(), async (req, res) => {
    const data = await api.getUserOrders(req.user._id)
    res.json(data)
})

router.post('/', async (req, res) => {
    let order = {};
    if (req.user) {
        order = {
            location: req.body.location,
            paymentMethod: req.body.paymentMethod,
            total: req.body.total,
            products: req.body.products,
            owner: req.user._id,
        };
    } else {
        order = {
            location: req.body.location,
            paymentMethod: req.body.paymentMethod,
            total: req.body.total,
            products: req.body.products,
            name: req.body.firstName + ' ' + req.body.lastName,
            phoneNumber: req.body.phoneNumber,
        };
    }
    try {
        const result = await api.create(order);
        res.status(201).json(result);
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error });
    }
});

router.post('/:id/fulfill', isAuthorized(), async (req, res) => {
    try {
        const result = await api.fulfill(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error });
    }
});

module.exports = router;
