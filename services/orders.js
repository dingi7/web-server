const Order = require('../models/Order');

async function getAll() {
    return Order.find({ fulfilled: false }).populate({ path: 'products', options: { strictPopulate: false } }).populate('owner');
}

async function getUserOrders(ownerId){
    return Order.find({ owner: ownerId }).populate({ path: 'products', options: { strictPopulate: false } }).populate('owner');
}

async function create(order) {
    const result = new Order(order);
    await result.save();

    return result;
}

function getById(id) {
    return Order.findById(id).populate({ path: 'products', options: { strictPopulate: false } }).populate('owner');
}

async function fulfill(id) {
    const order = await Order.findById(id);
    order.fulfilled = true;
    await order.save();
    return order;
}

module.exports = {
    getAll,
    create,
    getById,
    fulfill,
    getUserOrders
};
