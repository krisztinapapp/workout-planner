const mongoose = require('mongoose');
const Ranking = require('../models/ranking.model');
const User = require('../models/user.model');

module.exports.updateRanking = async (req, res, next) => {
    try {
        const category = req.body.category;
        const rankingData = await Ranking.findOne({ category: category });
        let ranking = null;

        // only for initilization of the rankings
        if (rankingData === null && (category === 'strength'|| category === 'health' || category === 'cardio')) {
            const res = await Ranking.create({
                category: category,
                ranking: []
            });
            ranking = res.ranking;
        }
        else {
            ranking = rankingData.ranking;
        }
        
        if (ranking.filter(e => e.userId == req._id).length > 0) {

            await Ranking.updateOne({ 
                category: req.body.category,
                "ranking.userId": req._id,
            }, { $set: { "ranking.$.points": req.body.userPoints }});
        }

        else if (ranking.length < 6) {
            await Ranking.updateOne(
                { category: req.body.category },
                { $addToSet: { ranking: {
                    userId: req._id,
                    username: req.body.username,
                    points: req.body.userPoints
                }}}
            );
        }
        
        else {
            const data = ranking.sort((a,b) => a.points - b.points)[0];
            if (data.points < req.body.userPoints) {
                await Ranking.updateOne({ 
                    category: req.body.category,
                    "ranking.userId": data.userId,
                }, { $set: { "ranking.$": {
                    userId: req._id,
                    username: req.body.username,
                    points: req.body.userPoints
                }}});
            }
            else {
                return res.status(422);
            }
        }

        return res.status(200);
    }
    catch(error) {
        console.error(error);
        res.status(500).send(error.message)
    }
};

module.exports.getRankings = async (req,res,next) => {
    Ranking.find({}, (err,rankings) => {
        if (!err) {
            res.send(rankings);
        } else {
            return next(err);
        }
    });
};