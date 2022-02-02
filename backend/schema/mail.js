const mongoose=require('mongoose')

var mailSchema=new mongoose.Schema({
  mail:{type:String,unique:true,required:true},
  threadId:{type:String,required:true},
  postedAt:Date,
  label:[String],
  from:{type:String},
  subject:String,
  body:{type:String, default:null},
  user_id:{type:Number,required:true},
  attachment:[{filename:String,mimeType:String,size:Number,attachmentId:String}]
})
module.exports = mongoose.model("Mails",mailSchema,"Mails");
