const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/node-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

mongoose.set('useFindAndModify', false);

module.exports = mongoose;