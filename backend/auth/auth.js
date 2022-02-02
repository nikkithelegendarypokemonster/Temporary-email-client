var express=require('express'),
    router=express.Router()
const {google}=require('googleapis')

var oAuth=new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
async function getToken(req,res,next){
    const {tokens}=await oAuth.getToken(req.body.code);
    oAuth.setCredentials(tokens);
    req.token=tokens
    next()
}
//Here access the code and get token
router.post('/',getToken,async(req,res)=>{

  const ticket =await oAuth.verifyIdToken({
    idToken:req.token.id_token,
    audience:'353081674923-nmsd7j08er63apkroqjcqdenufl3fuou.apps.googleusercontent.com'
  })
  const payload=ticket.getPayload()
  const userId=payload['sub']
  req.token.payload=payload
  req.token.userId=userId
  //res.cookie('GOOGLE TOKEN',req.token)
  res.send(req.token)
})



module.exports = router;
