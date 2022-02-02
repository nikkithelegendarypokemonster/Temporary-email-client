const express=require('express')
const app=express();
//schemas
const Mail=require('../schema/mail')
const {google}=require('googleapis')
var parseMessage = require('gmail-api-parse-message');
//create a new valid auth object
//setup auth object
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
//recieve email data
app.get('/:ver/:access/:userId',authenticate,async(req,res)=>{
  //getMessage(req,res,auth)
  //access gmail
  const gmail = google.gmail({version: `${req.params.ver}`, auth:req.auth});
  //get email list and sync
  await gmail.users.messages.list({userId:'me',q:"in:inbox category:primary "},
  (err,resp)=>{
    if (err) return res.status(500).send({message:"Need Valid Credentials"})
      //res.status(200).send(resp.data.messages)
      //get email body content
      resp.data.messages.forEach((item, index) => {
        gmail.users.messages.get({userId:'me',id:item.id},async(err,{data})=>{
          var parsedMessage = parseMessage(data);
          var mail={
            mail:parsedMessage.id,
            threadId:parsedMessage.threadId,
            postedAt:parsedMessage.headers.date,
            label:parsedMessage.labelIds,
            from:parsedMessage.headers.from,
            subject:parsedMessage.headers.subject,
            body:parsedMessage.snippet,
            user_id:req.params.userId,
            attachment:parsedMessage.attachments
          };
          //saving and updating email database on gmail emails for syncing
          try {
            if((mail.subject!=="Fwd:" && mail.subject!=="Re:"))
              await Mail.findOneAndUpdate({mail:parsedMessage.id},mail,{upsert:true,new:true})
          } catch (e) {
            console.log(e);
          }
        })
      });
  })
  //after syncing get all mails
  await Mail.find({user_id:req.params.userId},(err,docs)=>{
    res.send(docs)
  }).clone();

})
module.exports = app;
