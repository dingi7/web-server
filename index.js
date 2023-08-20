const express = require('express');
const mongoose = require('mongoose');

const cors = require('./middlewares/cors');
const catalogController = require('./controllers/catalog');
const usersController = require('./controllers/users');
const ordersController = require('./controllers/orders');
const auth = require('./middlewares/auth');



const PORT = process.env.PORT || 3030;

async function start() {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect('mongodb://mongo:ZkBoi3mY7540VHMkFL9D@containers-us-west-133.railway.app:6830', {
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
    app.use(cors());
    app.use(auth());
    app.use('/data/catalog', catalogController);
    app.use('/orders', ordersController);
    app.use('/users', usersController);

    app.get('/', (req, res) =>
        res.json({ message: 'REST service operational' })
    );

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server started on port ${PORT}`);
    });
}
start();