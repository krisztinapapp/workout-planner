const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    exerciseName: String,
    reps:  Number,
    sets: Number,
    weight: Number,
    distance: String,
    duration: String,
    note: String
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = Exercise;

mongoose.model('Exercise', exerciseSchema);