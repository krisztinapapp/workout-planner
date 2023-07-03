const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
    {
        weight: Number,
        arms: Number,
        bust: Number,
        waist: Number,
        hips: Number,
        thighs: Number,
        calves: Number,
        date: {
            type: String,
            required: true,
        }
    }
);

const Milestone = mongoose.model('Milestone', milestoneSchema);
module.exports = Milestone;

mongoose.model('Milestone', milestoneSchema);