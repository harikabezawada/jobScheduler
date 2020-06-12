const config = require("../config");
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true }, function (err, db) {
    if (err) {
        console.log(err)
        throw err
    }
    else {
        console.log('connected to db')
    }
})
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../model/user'),
    Job: require("../model/job")


};