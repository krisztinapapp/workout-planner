const mongoose = require('mongoose');

const pictureSchema = new mongoose.Schema({
    content: Buffer,
    userId: mongoose.Types.ObjectId,
    date: Date,
});

const Picture = mongoose.model('Picture', pictureSchema);
module.exports = Picture;

module.exports = mongoose.model('Picture', pictureSchema);