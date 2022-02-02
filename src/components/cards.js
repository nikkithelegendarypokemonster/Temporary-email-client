import  {useNavigate} from 'react-router-dom'
const axios=require('axios')
function Card(props){
  //console.log(props.item);
  var myRe =/(?=<)(.*)(?!=>)/g;
  var rep=new RegExp(`(?<=^.{50}).*`,"g")
  var from = myRe.exec(props.item.from)[0];
  if(props.item.body!==""){
    var body=props.item.body.replace(rep,"...")
  }else{
     body="..."
  }
  var subj=props.item.subject
  const navigate = useNavigate();
  const viewMail=async(e)=>{
    navigate("/view", { state: props.item});
  }
  const deleteMsg=async(e)=>{
    var mailId=props.item.mail
    var access=localStorage.getItem("token");
    var refresh=localStorage.getItem("token_2")
    var {data}=await axios.delete(`http://localhost:4000/delete/v1/${access}/${mailId}`,{
      headers:{
        Refresh:`${refresh}`
      }
    })
    console.log(data);
  }
  return(
    <>
      <div style={{border:"1px solid black",margin:"4px"}}>
      <div onClick={viewMail}>
      <span><h3>{(subj)?subj:"No Subject"}</h3></span>
      <span><b>{from}</b></span>
      <span>{body}</span>
      <br></br>
      </div>
      <button onClick={deleteMsg}>Delete</button>
      </div>
    </>

  )
}

export default Card
