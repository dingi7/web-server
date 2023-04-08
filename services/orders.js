const Order = require('../models/Order');

async function getAll() {
    return Order.find({ fulfilled: false })
        .populate({ path: 'products', options: { strictPopulate: false } })
        .populate('owner');
}

async function getUserOrders(ownerId) {
    return Order.find({ owner: ownerId })
        .populate({ path: 'products', options: { strictPopulate: false } })
        .populate('owner');
}

async function create(order) {
    const result = new Order(order);
    await result.save();

    return result;
}

function getById(id) {
    return Order.findById(id)
        .populate({ path: 'products', options: { strictPopulate: false } })
        .populate('owner');
}

async function fulfill(id) {
    const order = await Order.findById(id);
    order.fulfilled = true;
    await order.save();
    return order;
}

async function getOrderStatistics() {
    const bestSellingProduct = await Order.aggregate([
        { $unwind: '$products' },
        { $group: { _id: '$products', sales: { $sum: 1 } } },
        { $sort: { sales: -1 } },
        { $limit: 1 },
        {
            $lookup: {
                from: 'items',
                localField: '_id',
                foreignField: '_id',
                as: 'product',
            },
        },
        { $unwind: '$product' },
        { $project: { name: '$product.name', sales: 1, _id: 0 } },
    ]);

    const totalSales = await Order.aggregate([
        { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const salesForTheWeek = await Order.aggregate([
        { $match: { createdAt: { $gte: startOfWeek, $lt: endOfWeek } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    return {
        bestSellingProduct: bestSellingProduct[0],
        totalSales: totalSales[0].total,
        salesForTheWeek: salesForTheWeek[0] ? salesForTheWeek[0].total : 0,
    };
}
module.exports = {
    getAll,
    create,
    getById,
    fulfill,
    getUserOrders,
    getOrderStatistics,
};
