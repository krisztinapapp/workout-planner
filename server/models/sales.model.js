const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema(
    {
        ownerId: mongoose.Types.ObjectId,
        buyerId: mongoose.Types.ObjectId,
        planId: mongoose.Types.ObjectId,
        planName: String,
        price: Number,
        date: Date
    }
);

const Sales = mongoose.model('Sales', salesSchema);
module.exports = Sales;

mongoose.model('Sales', salesSchema);