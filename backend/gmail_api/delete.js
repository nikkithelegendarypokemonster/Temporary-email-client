const express=require('express')
const app=express();
const {google}=require('googleapis')
var parseMessage = require('gmail-api-parse-message');
const Mail=require('../schema/mail')

const authenticate=(req,res,next)=>{
  const auth=new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET)
    // /console.log(req.params.access);
    auth.setCredentials({
      access_token:req.params.access,
      refresh_token:req.get('Refresh')
    })
    req.auth=auth
    next()
}
const sync=async(req,res,next)=>{
  await Mail.findOneAndDelete({mail:req.params.mailId},(err,res)=>{
    console.log(res);
  }).clone()
  next()
}
app.delete('/:ver/:access/:mailId',authenticate,sync,async(req,res)=>{
  const gmail = google.gmail({version: `${req.params.ver}`, auth:req.auth});
  await gmail.users.threads.delete({userId:'me',id:req.params.mailId},(err,resp)=>{
    (err)?console.log(err):res.send("success")
  })
})
module.exports = app;
