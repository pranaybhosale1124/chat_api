const mongoose = require('mongoose');

const uri = process.env.MONGOURI;

mongoose.connect(uri, { })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

module.exports = mongoose;
