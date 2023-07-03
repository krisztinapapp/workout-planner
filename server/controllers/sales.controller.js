const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Sales = require('../models/sales.model');

module.exports.getSales = async (req,res,next) => {
    Sales.find({
        ownerId: req._id
    }, (err,sales) => {
        if (!err) {
            res.send(sales);
        } else {
            return next(err);
        }
    });
};