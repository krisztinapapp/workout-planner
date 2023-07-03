const mongoose = require('mongoose');
const exerciseSchema = require('./exercise.model').schema;

const workoutSchema = new mongoose.Schema({
    workoutName:  {
        type: String,
        required: true
    },
    dayOfTheWeek: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        default: 'monday'
    },
    exercises: [exerciseSchema]
});

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;

mongoose.model('Workout', workoutSchema);