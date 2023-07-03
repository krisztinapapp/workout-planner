const mongoose = require('mongoose');

function exceedsMaxArraySize(array) {
    return array.length <= 10;
}

const rankingSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            enum: ['strength', 'cardio', 'health'],
            unique: true
        },
        ranking: {
            type: [{
                userId: mongoose.Types.ObjectId,
                username: String,
                points: Number
            }],
            validate: [exceedsMaxArraySize, 'Maximum 10 elemet lehet tárolni ebben a listában']
        }
    }
);

const Ranking = mongoose.model('Ranking', rankingSchema);
module.exports = Ranking;

mongoose.model('Ranking', rankingSchema);