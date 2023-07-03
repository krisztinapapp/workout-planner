const mongoose = require('mongoose');
const workoutSchema = require('./workout.model').schema;

const planSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId
    },
    planName:  {
        type: String,
        required: true
    },
    durationInWeeks: {
        type: Number,
        required: true
    },
    workouts: [workoutSchema],
    price: Number,
    public: Boolean,
});

const Plan = mongoose.model('Plan', planSchema);
module.exports = Plan;

mongoose.model('Plan', planSchema);