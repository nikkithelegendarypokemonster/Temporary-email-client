import  {useLocation} from 'react-router-dom'
import {useState} from 'react'
import Attach from './attachment'
import Threads from './threads'
const axios=require('axios')
function View(props){
  const [threads,setThreads]=useState()
  const {state}=useLocation()
  console.log(state);
  //get the threads onLoad
    async function getThreads(){
      var mailId=state.mail
      var threadId=state.threadId
      var access=localStorage.getItem("token");
      var refresh=localStorage.getItem("token_2")
      var {data}=await axios.get(`http://localhost:4000/threads/v1/${access}/${threadId}/${mailId}`,{
        headers:{
          Refresh:`${refresh}`
        }
      })
      if(data){
        setThreads(data)
      }
    }
    if(!threads){ getThreads()}


  return(
    <>
      <p>From:{state.from}</p>
      <h1>Subject:{state.subject}</h1>
      <p><b>Message:</b><br></br>{state.body}</p>
      {
        (state.attachment.length>0)?
          state.attachment.map((item,i)=>{return <Attach key={i} mailId={state.mail}item={item}/>})
        :
        <p>No Attachments</p>

      }
      <p><b>Threads:</b></p><br></br>
      {
        (threads)?
          ( threads.length>1)?
            threads.slice(1).map((item,i)=>{return <Threads key={i} item={item}/>})
          :
          <p>No Threads</p>
        :
          <p>No Threads</p>

      }
    </>
  )
}

export default View
