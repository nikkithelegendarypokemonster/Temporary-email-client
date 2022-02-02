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
  //change label of UNSEEN to SEEN in dB
  //get the array and modify here then update the new array in dB
  //get mail content
  await Mail.find({mail:req.params.mailId},async(err,res)=>{
    if(res[0].label.includes("UNREAD")){
      const index = res[0].label.indexOf("UNREAD");
          if (index > -1) {
            res[0].label.splice(index, 1);
          }
      await Mail.findOneAndUpdate({mail:req.params.mailId},{label:res[0].label},{new:true},(err,res)=>{
        console.log(res);
      }).clone();
    }
  }).clone();
  //sync readings to gmail
  const gmail = google.gmail({version: `${req.params.ver}`, auth:req.auth});
  await gmail.users.messages.modify({userId:'me',id:req.params.mailId, resource:{'removeLabelIds': ['UNREAD']}},(err,resp)=>{
    console.log(resp);
  })
  next()
}
app.get('/:ver/:access/:threadId/:mailId',authenticate,sync,async(req,res)=>{
  const gmail = google.gmail({version: `${req.params.ver}`, auth:req.auth});
  await gmail.users.threads.get({userId:'me',id:req.params.threadId},(err,resp)=>{
    var arr=resp.data.messages.map((item,i)=>{
      return parseMessage(item)
    })
    res.send(arr)
  })
})
module.exports = app;
