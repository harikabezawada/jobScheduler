const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userName: { type: String ,unique:true},
    email:{type:String,requred:true},
    password:{type:String},
    salt:{type:String},
    createdDate: { type: Date,default:Date.now },
    jobs:[{type: mongoose.Schema.Types.ObjectId,ref:'jobs'}]
   
});


module.exports = mongoose.model('users', schema);
