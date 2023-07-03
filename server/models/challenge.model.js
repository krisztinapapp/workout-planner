const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['strength', 'cardio', 'health'],
            default: 'health' 
        },
        points: {
            type: Number,
            default: 1
        }
    }
);

const Challenge = mongoose.model('Challenge', challengeSchema);
module.exports = Challenge;

mongoose.model('Challenge', challengeSchema);