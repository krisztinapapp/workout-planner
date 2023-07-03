const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const milestoneSchema = require('./milestone.model').schema;
require('../config/config');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: 'Email is required.'
        },
        username: {
            type: String,
            required: 'Username is required.'
        },
        password: {
            type: String,
            required: 'Password is required.'
        },
        isCoach: Boolean,

        plans: [mongoose.Types.ObjectId],
        currentPlans: [mongoose.Types.ObjectId],
        milestones: [milestoneSchema],
        challenges: [mongoose.Types.ObjectId],
        rankings: {
            strength: Number,
            health: Number,
            cardio: Number
        },
        saltSecret: String
    }
);

userSchema.pre('save', function(next) {
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(this.password,salt,(err,hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        })
    })
});

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function() {
    return jwt.sign( { _id: this._id },
            process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXP
        });
};

const User = mongoose.model('User', userSchema);
module.exports = User;

mongoose.model('User', userSchema);