const express=require('express')
const nodemailer=require('nodemailer');
const app=express();
//schemas
const Mail=require('../schema/mail')
const multer=require('multer')
const fs=require('fs')
const {google}=require('googleapis')
var parseMessage = require('gmail-api-parse-message');
const fileStorage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'backend/upload')
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+"--"+file.originalname)
  }
})
const upload=multer({storage:fileStorage})


//authenticate googleapis
const authenticate=(access,refresh)=>{
  const auth=new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET)
    // /console.log(req.params.access);
    console.log(refresh);
    auth.setCredentials({
      access_token:access,
      refresh_token:refresh
    })
    return auth
}

// send->sync->delete in server storage->serve all updated mails
const send=async(req,res,next)=>{
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user:'supernikki1234@gmail.com', // generated ethereal user
      pass: 'HerbieChap1899', // generated ethereal password
    },
  });
 const mail={
    from:`Email Buddy <supernikki1234@gmail.com>`,
    to:'supernikki1234@gmail.com',
    subject:req.body.subject,
    text:req.body.content,
    attachments:req.files.map(item=>{
      return {
        filename:item.filename,
        path:item.path
      }
    })
  }
 const result=await transporter.sendMail(mail)
 next()
}
const sync=async(req,res,next)=>{
  const auth=authenticate(req.params.access,req.get('Refresh'))
  const gmail = google.gmail({version: 'v1', auth:auth});
  //get email list and sync
  //console.log(auth);
  await gmail.users.messages.list({userId:'me',q:"in:inbox category:primary"},
  (err,resp)=>{
    if (err) {
      console.log(err);
    }else
      //res.status(200).send(resp.data.messages)
      //get email body content
      resp.data.messages.forEach(async(item, index) => {
        await gmail.users.messages.get({userId:'me',id:item.id},async(err,{data})=>{
          var parsedMessage = await parseMessage(data);
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
          console.log(mail);
          //saving and updating email database on gmail emails for syncing
          try {
            if((mail.subject!=="Fwd:" && mail.subject!=="Re:") )
              await Mail.findOneAndUpdate({mail:parsedMessage.id},mail,{upsert:true,new:true})
          } catch (e) {
            console.log(e);
          }
        })
      });
  })
  next()
}
const sDelete=(req,res,next)=>{
  //delete the file
  fs.readdir('backend/upload',(err,files)=>{
    if(err) console.log(err);
    files.forEach(file => {
        fs.unlink('backend/upload/'+file,(err)=>{
          (err)?console.log(err):console.log('deleted');
        })
    });
  })
  next()
}
app.post('/many/:access/:userId',upload.array('files'),send,sDelete,sync,async (req,res)=>{
  //after syncing get all mails
  await Mail.find({user_id:req.params.userId},(err,docs)=>{
    //send back all emails of user
    res.send(docs)
  }).clone();
})
module.exports = app;
