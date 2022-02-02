const express=require('express')
const app=express();
const {google}=require('googleapis')
var parseMessage = require('gmail-api-parse-message');

const authenticate=(req,res,next)=>{
  const auth=new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET)
    // /console.log(req.params.access);
    auth.setCredentials({
      access_token:req.params.access,
      refresh_token:req.get('refresh')
    })
    req.auth=auth
    next()
}
app.get('/:ver/:attach/:msg/:access',authenticate,async(req,res)=>{
  const gmail = google.gmail({version: `${req.params.ver}`, auth:req.auth});
  await gmail.users.messages.attachments.get({userId:'me',messageId:req.params.msg,id:req.params.attach},(err,resp)=>{
    res.send(resp.data)
  })
})
module.exports = app;
