const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const User = require('../models/user.model');
const Sales = require('../models/sales.model');
const Plan = require('../models/plan.model');

async function sendEmail(userEmail, coachEmail, planName, price) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        name: "example.com",
        secure: false,
        auth: {
            user: 'teszt.szakdolgozathoz@gmail.com',
            pass: 'vlsibkebwyhrmwdo'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let info = await transporter.sendMail({
        from: "teszt.szakdolgozathoz@gmail.com",
        to: userEmail,
        subject: "Sikeres vásárlás",
        html: `
            <h3>Sikeres vásárlás!</h3>
            <p>Az általad vásárolt edzésterv: ${planName} (ár: ${price} Ft)</p>
            <p>Jó edzést kívánunk!</p>
        `,
    });

    console.log("Message sent: %s", info.messageId);

    info = await transporter.sendMail({
        from: "teszt.szakdolgozathoz@gmail.com",
        to: coachEmail,
        subject: "Sikeres eladás",
        html: `
            <h3>Sikeres eladás!</h3>
            <p>Az általad eladott edzésterv: ${planName} (ár: ${price} Ft)</p>
            <p>Az eladási statisztikákat a "Saját edzéstervek" oldalon található linken tudod letölteni.</p>
        `
    });

    console.log("Message sent: %s", info.messageId);
}

module.exports.signup = async (req,res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            isCoach: req.body.isCoach,
            rankings: {
                strength: 0,
                health: 0,
                cardio: 0
            }
        })
        console.log(user);
        return res.status(200).json({ ok: true });
    } catch(err) {
        console.log('user.controller: Error signing up');
        console.log(err);
        return res.status(422).json({ ok: false, error: 'Duplicate email' });
    }
    
};

module.exports.authenticate = async (req,res) => {
    const password = req.body.password;

    const user = await User.findOne({
        email: req.body.email,
    });

    if(!user) {
        console.log('User is not registered.');
        return res.status(404).json({ ok: false, error: 'Not registered' });
    } else if(!user.verifyPassword(password)) {
        console.log('Wrong password.');
        return res.status(401).json({ ok: false, error: 'Wrong password' });
    } else {
        console.log('Verified login data.');
        const token = user.generateJwt();
        return res.status(200).json({ ok: true, token: token, userId: user._id, isCoach: user.isCoach });
    }
};

module.exports.getUserInfo = async (req,res,next) => {
    User.findOne({
        _id: req._id
    }, (err,user) => {
        if (!err) {
            res.send(user);
        } else {
            return next(err);
        }
    });
};

module.exports.buyPlan = async (req,res) => {
    try {
        if(req.body.plan.userId === req._id) {
            return res.status(422).json({ ok: false });
        }
        const response = await User.updateOne(
            { _id: req._id },
            { $addToSet: { plans: req.body.plan._id }}
        );

        if(response.modifiedCount > 0) {
            await Sales.create({
                ownerId: req.body.plan.userId,
                buyerId: req._id,
                planId: req.body.plan._id,
                planName: req.body.plan.planName,
                price: req.body.plan.price,
                date: new Date()
            })
            const userEmail = await User.findOne({_id: req._id}, 'email').then((res) => res.email).catch(err => console.log(err));
            const coachEmail = await User.findOne({_id: req.body.plan.userId}, 'email').then((res) => res.email).catch(err => console.log(err));

            //const userEmail = "teszt.szakdolgozathoz@gmail.com";
            //const coachEmail = "teszt.szakdolgozathoz@gmail.com";
            await sendEmail(userEmail, coachEmail, req.body.plan.planName, req.body.plan.price).catch((err) => console.log(err));
            return res.status(200).json({ ok: true });
        }
        else {
            return res.status(422).json({ ok: false, error: "Couldn't buy plan" });
        }

    } catch(err) {
        console.log('user.controller: Error buying plan');
        console.log(err);
        return res.status(422).json({ ok: false, error: "Couldn't buy plan" });
    }
};

module.exports.selectCurrentPlan = async (req,res) => {
    try {
        await User.updateOne(
            { _id: req._id },
            { $addToSet: { currentPlans: req.params.id }}
        )
        return res.status(200).json({ ok: true });
    } catch(err) {
        console.log('user.controller: Error selecting plan');
        console.log(err);
        return res.status(422).json({ ok: false, error: "Couldn't select plan" });
    }
};

module.exports.removeCurrentPlan = async (req,res) => {
    try {
        await User.updateOne(
            { _id: req._id },
            { $pull: { currentPlans: req.params.id }}
        );
        return res.status(200).json({ ok: true });
    } catch(err) {
        console.log('user.controller: Error selecting plan');
        console.log(err);
        return res.status(422).json({ ok: false, error: "Couldn't select plan" });
    }
};

module.exports.getCurrentPlans = async (req,res,next) => {
    try {
        const currentPlanIds = await User.findOne({_id: req._id}, 'currentPlans').then((res) => res.currentPlans);
        const currentPlans = [];
        for (id of currentPlanIds) {
            const plan = await Plan.findOne({_id: id});
            currentPlans.push(plan)
        }
        res.send(currentPlans);
    }
    catch(err) {
        console.error(err);
        res.status(500).send(err.message)
    };
};

module.exports.addMilestone = async (req,res,next) => {
    try {
        const today = new Date();
        const dateString = today.toLocaleDateString("hu-HU");
        await User.updateOne(
            { _id: req._id },
            { $addToSet: { milestones : {
                weight: req.body.milestone.weight,
                arms: req.body.milestone.arms,
                bust: req.body.milestone.bust,
                waist: req.body.milestone.waist,
                hips: req.body.milestone.hips,
                thighs: req.body.milestone.thighs,
                calves: req.body.milestone.calves,
                date: dateString
            }}}
        )
    }
    catch(error) {
        console.error(error);
        res.status(500).send(error.message)
    }
};


module.exports.deleteMilestone = async (req,res) => {
    try {
        await User.updateOne(
            { _id: req._id },
            { $pull: { milestones: {
                _id: req.params.id
            }}}
        )
        return res.status(200).json({ ok: true });
    } catch(err) {
        console.log('user.controller: Error deleting milestone');
        console.log(err);
        return res.status(422).json({ ok: false, error: "Couldn't delete milestone" });
    }
};

module.exports.finishChallenge = async (req,res,next) => {
    try {
        const response = await User.updateOne(
            { _id: req._id },
            { 
                $addToSet: { challenges :
                    req.body.challenge
                },
            },
        );
        if(response.modifiedCount > 0) {
            await User.updateOne(
                { _id: req._id },
                { 
                    $set: { rankings:
                        req.body.rankings
                    }
                },
            );
            res.send(req.body.rankings)
        }
        else {
            const user = await User.findOne({ _id: req._id }).catch(err => console.log(err));
            res.send(user.rankings);
        }
    }
    catch(error) {
        console.error(error);
        res.status(500).send(error.message)
    }
};
