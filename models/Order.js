const {
    model,
    Schema,
    Types: { ObjectId },
} = require('mongoose');

const schema = new Schema({
    total: { type: Number, required: true },
    location: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    fulfilled: { type: Boolean, default: false },
    products: [{ type: ObjectId, ref: 'Item' }],
    name: { type: String },
    phoneNumber: { type: String },
    owner: { type: ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

const Order = model('Order', schema);

module.exports = Order;
