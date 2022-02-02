import Card from "./cards.js"
const {useState}=require('react')
const axios=require('axios')
function EBody(){
  const[mails,setMails]=useState()
  const[activate,setActivate]=useState(false)
      const test=async()=>{
        var access=localStorage.getItem("token");
        var refresh=localStorage.getItem("token_2")
        var id=localStorage.getItem("UserId")
        var{data}=await axios.get(`http://localhost:4000/gmail/v1/${access}/${id}`,{
          headers:{
            Refresh:`${refresh}`
          }
        })
        if(data) setMails(data)
      }
      //use test function after render
      // if(!mails){
      //   test()
      // }
      if(!mails){
        test()
      }

    const popForm=(e)=>{
      setActivate(true)
    }
    const sendMail=async(e)=>{
      e.preventDefault()
      var access=localStorage.getItem("token")
      var refresh=localStorage.getItem("token_2")
      var id=localStorage.getItem("UserId")
       var form=new FormData(e.target);
       await axios.post(`http://localhost:4000/send/many/${access}/${id}`,form,{
         headers:{
           Refresh:`${refresh}`
         }
       }).then(res=>{
         console.log(res);
         setMails(res.data)
         window.location.reload();
       })
    }
  return(
    <>
    <button onClick={popForm}>Send Email</button>
    {
      (activate)?
        <div>
          <form onSubmit={sendMail} encType="multipart/form-data">
          <span>To:</span><input type="text" name="to"></input><br></br>
          <span>Subject:</span><input type="text" name="subject"></input><br></br>
          <span>Message:</span><textarea type="text" name="content"></textarea><br></br>
          <span>Attachment:</span><input type="file" name="files" multiple></input><br></br>]
          <button type="submit" >Submit</button>
          </form>
        </div>
      :null
    }
    {
      (mails)?
      //console.log(mails)
        mails.map((item, i) => {
          return <Card key={i} item={item}></Card>
        })
      :
        <h1>No Mails</h1>
    }
    </>
  )
}

export default EBody
