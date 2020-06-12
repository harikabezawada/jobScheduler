const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    jobName: { type: String },
    createdDate: { type: Date,default:Date.now },
   scheduleDate:{type: Number},
   createdBy:{type: mongoose.Schema.Types.ObjectId,ref:'users'}
});


module.exports = mongoose.model('jobs', schema);
