const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const catalogController = require('./controllers/catalog');
const usersController = require('./controllers/users');
const ordersController = require('./controllers/orders');
const emailController = require('./controllers/email')
const auth = require('./middlewares/auth');



const PORT = process.env.PORT || 3030;

async function start() {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect('mongodb+srv://vercel-admin-user-64ea4ff6f90cc0576df2bb2b:0GkehvHbFUNgkEsw@cluster0.wbjudbp.mongodb.net/cakeHouse?retryWrites=true&w=majority', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log('Database ready');
    } catch (err) {
        console.error('Database connection failed');
        process.exit(1);
    }

    const app = express();
    app.use(express.json());
    app.use(cors({
        origin: "*",
        methods: "*",
        credentials: true
    }))
    app.use(auth());
    app.use('/data/catalog', catalogController);
    app.use('/orders', ordersController);
    app.use('/users', usersController);
    app.use('/contact', emailController)

    app.get('/', (req, res) =>
        res.json({ message: 'REST service operational' })
    );

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server started on port ${PORT}`);
    });
}

start()