const express=require('express')
const app=express();
const port=4000 || process.env.NODE_ENV
const cors = require('cors');
require('dotenv').config()
const mongoose=require('mongoose')
//Db Connection
var DB_URI="mongodb+srv://Nikki:HerbieChap1899@emailserver01.mqulb.mongodb.net/EmailServer"
mongoose.connect(DB_URI,{useNewUrlParser: true, useUnifiedTopology: true},()=>{
  console.log("Connection Successfully");
},e=>{
  console.error(e);
})
//routes
var authRoute=require('./auth/auth.js');
var gRoute=require('./gmail_api/recieve.js')
var aRoute=require('./gmail_api/download.js')
var sendMail=require('./gmail_api/send.js')
var tRoute=require('./gmail_api/thread.js')
var deleteMail=require('./gmail_api/delete.js')
app.use(cors({
  credentials:true,
  origin:'http://localhost:3000'
}))
app.use(express.json())

app.use('/auth',authRoute)
app.use('/gmail',gRoute)
app.use('/attachment',aRoute)
app.use('/send',sendMail)
app.use('/threads',tRoute)
app.use('/delete',deleteMail)
app.listen(port,()=>{
  console.log("Listening on port:",port);
})
