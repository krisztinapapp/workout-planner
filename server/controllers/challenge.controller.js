const mongoose = require('mongoose');
const Challenge = require('../models/challenge.model');

module.exports.addChallenge = async (req, res, next) => {
    const points = req.body.challenge.points ? req.body.challenge.points : 1;
    try {
        await Challenge.create({
            name: req.body.challenge.name,
            type: req.body.challenge.type,
            points: points,
        });
    }
    catch(error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

module.exports.getChallenges = async (req,res,next) => {
    Challenge.find({}, (err,challenges) => {
        if (!err) {
            res.send(challenges);
        } else {
            return next(err);
        }
    });
};
