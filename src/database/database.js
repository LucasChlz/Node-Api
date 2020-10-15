const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/node-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

module.exports = mongoose;