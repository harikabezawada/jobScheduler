var express = require('express');
var router = express.Router();
var jobService=require("../controller/jobService")
var nodemailer = require('nodemailer');
const db = require('../helper/db');
const Job=db.Job
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({status:200,message:"this is sameple response"});
});
router.post("/signUp",addUser)
router.post("/signIn",authenticateUser)
router.post("/scheduleJob",createJob)
router.get("/schedulesList",getscheduledTasksList)
module.exports = router;

function addUser(req,res,next){
jobService.signup(req).then((resp)=>{
res.send(resp)
}).catch((err)=>{
next(err)
})
}
(function () {

    var job = new CronJob('* * * * *', function () {
      var currentTime=new Date().getTime()
     let jobData= await Job.find({scheduleDate:currentTime})
jobData.forEach(element => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',//smtp.gmail.com  //in place of service use host...
    secure: false,//true
    port: 25,//465
    auth: { user: config.mailUser, pass: config.mailPassword },
    tls: {
        rejectUnauthorized: false
    }
});
var mailOptions = {
    from: config.mailUser,
    to: req.body.email,
    subject: 'Scheduled Task',
   text: "Your task has been scheduled today"

}
transporter.sendMail(mailOptions, function (err) {
  

});

});
    }, null, true, 'America/Los_Angeles');
  
    job.start();
    console.log('eyo')
  })();
  
function authenticateUser(req,res,next){
  console.log("tttttt")
  jobService.signIn(req).then((resp)=>{
  res.send(resp)
  }).catch((err)=>{
  next(err)
  })
  }
  function createJob(req,res,next){
    //console.log(req)
    jobService.schedleJob(req).then((resp)=>{
    res.send(resp)
    }).catch((err)=>{
    next(err)
    })
    }
    function getscheduledTasksList(req,res,next){
      console.log(req.headers)
      jobService.getScheduledTasks(req).then((resp)=>{
      res.send(resp)
      }).catch((err)=>{
      next(err)
      })
      }
