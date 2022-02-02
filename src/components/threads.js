
function Threads(props){

  return(
    <>
    <div style={{border:"2px solid black",margin:"2px"}} dangerouslySetInnerHTML={{__html: props.item.textHtml}} />
    </>

  )
}

export default Threads
