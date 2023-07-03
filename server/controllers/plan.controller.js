const mongoose = require('mongoose');
const Plan = require('../models/plan.model');
const User = require('../models/user.model');
const Sales = require('../models/sales.model');

module.exports.savePlan = async (req,res) => {
    try {
        const plan = req.body.plan;
        plan.userId = req._id;
        await Plan.create(plan);
        return res.status(200).json({ ok: true });
    } catch(err) {
        console.log('plan.controller: Error saving plan');
        console.log(err);
    }
};

module.exports.getPublicPlans = async (req,res,next) => {
    Plan.find({
        public: true
    }, (err,plans) => {
        if (!err) {
            res.send(plans);
        } else {
            return next(err);
        }
    });
};

module.exports.getUserPlans = async (req,res,next) => {
    const purchasedPlanIds = await User.findOne({_id: req._id}, 'plans').then((res) => res.plans);
    const purchasedPlans = [];
    for (id of purchasedPlanIds) {
        const plan = await Plan.findOne({_id: id});
        purchasedPlans.push(plan)
    }
    Plan.find({
        userId: req._id
    }, (err,plans) => {
        if (!err) {
            const userPlans = [...purchasedPlans, ...plans];
            res.send(userPlans);
        } else {
            return next(err);
        }
    });
};

module.exports.deletePlan = async (req,res,next) => {
    try {
        const isCoach = await User.findOne({_id: req._id}, 'isCoach').then((res) => res.isCoach).catch(err => console.log(err));

        const response = await User.updateOne(
            { _id: req._id },
            { $pull: { plans: req.params.id }}
        );

        if(response.modifiedCount === 0) {
            if(isCoach) {
                const salesData = await Sales.findOne({ planId: req.params.id });
                if(salesData) {
                    console.log("found sales data");
                    return res.status(422).json({ok: false});
                }
                else {
                    console.log("ready to delete");
                    await Plan.deleteOne({ _id: req.params.id });
                }
            }
            else {
                await Plan.deleteOne({ _id: req.params.id });
            }
        }
        await User.updateOne(
            { _id: req._id },
            { $pull: { currentPlans: req.params.id }}
        );
        
        res.status(200).json({ ok: true });
    }
    catch(err) {
        console.error(err);
        res.status(500).send(err.message)
    }
};

module.exports.changePlanPublicity = async (req,res,next) => {
    try {
        await Plan.updateOne({
            _id: req.body.planId,
            userId: req._id
        }, { $set: { public: req.body.public }});
        res.status(200).json({ ok: true });
    }
    catch(err) {
        console.error(err);
        res.status(500).send(err.message)
    }
};