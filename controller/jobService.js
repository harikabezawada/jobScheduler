
const db = require('../helper/db');
var ObjectId = require('mongodb').ObjectID; const config = require("../config")
var crypto = require('crypto');
const jwtoken = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const User = db.User;
const Job = db.Job
const passwordgen = require("../helper/passwordGenerate")

async function signup(req, res) {
    console.log(req.body)
    try {
        if (await User.findOne({ userName: req.body.username }))
            return ({ status: 409, message: "UserName already exist" })
        else {
            let passwordData = passwordgen.saltHashPassword(req.body.password)
            user = new User({ userName: req.body.username, email: req.body.email, password: passwordData.passwordHash, salt: passwordData.salt, });
            await user.save()
            return ({ status: 200, message: "User data added successfully" })

        }
    }
    catch (err) {
        throw err;
    }
}

async function signIn(req) {
    try {
        let doc = await User.findOne({ "userName": req.body.username })
        if (doc != '') {

            console.log(doc, doc.salt)
            if (!passwordgen.validatePassword(req.body.password, doc.salt, doc.password))
                return ({ status: 403, mesage: "Password doesn't match" })

            const userdoc = await User.findOne({ "userName": req.body.username }).select('userName')
            const token = jwtoken.sign({ sub: userdoc._id }, config.secret);
            return ({ status: 200, message: "LoggedIn Succesful", data: userdoc, token: token })


        }

    }
    catch (error) {
        throw error;
    }
}

async function schedleJob(req){
try{
    console.log('headers',req.headers)
    let decoded = req.headers.authorization.split(" ")[1]
    let token = jwtDecode(decoded).sub
let data={
    jobName:req.body.name,
    scheduleDate:new Date(req.body.date+" "+req.body.time).getTime(),
    createdBy:ObjectId(token)
    
}
   
    console.log(new Date(req.body.date+" "+req.body.time).getTime(),new Date().getTime(),Date.parse(req.body.date+" "+req.body.time)==new Date().getTime())
       job=new Job(data)
    let jobDoc=await job.save()
   
    await User.update({_id:token},{$push:{jobs:jobDoc._id}}) 
      return ({status:200,message:"created job Successfully"}) 
}

catch(err){
    throw err;
}
}
async function getScheduledTasks(req){
    try{
        console.log('headers',req.headers)
        let decoded = req.headers.authorization.split(" ")[1]
        let token = jwtDecode(decoded).sub
        let jobsList=await User.findOne({_id:token}).populate('jobs').select('jobs')
        return ({status:200,jobsList:jobsList}) 
    }
    catch(err){
        throw err;
    }
}

module.exports = {
    signup,
    signIn,
    schedleJob,
    getScheduledTasks

}