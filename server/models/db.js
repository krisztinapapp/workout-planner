const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', function () {
  console.log('Connected to MongoDB successfully');
});

require('./user.model');