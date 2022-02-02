const axios=require('axios')
function Attachment(props){
  // console.log(props.item);
  async function downloadAttachments(e){
    console.log(props.item);
    var attachId=props.item.attachmentId
    var msgId=props.item.mailId
    var access=localStorage.getItem("token");
    var refresh=localStorage.getItem("token_2")
      var {data}=await axios.get(`http://localhost:4000/attachment/v1/${attachId}/${msgId}/${access}`,{
        headers:{
          Refresh:`${refresh}`
        }
      })
      console.log(data.data);
      const byteCharacters = atob(data.data.replace(/_/g, '/').replace(/-/g, '+'));
       const byteArrays = [];
       const sliceSize=512
       for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
         const slice = byteCharacters.slice(offset, offset + sliceSize);

         const byteNumbers = new Array(slice.length);
         for (let i = 0; i < slice.length; i++) {
           byteNumbers[i] = slice.charCodeAt(i);
         }

         const byteArray = new Uint8Array(byteNumbers);
         byteArrays.push(byteArray);
       }
      var blob=new Blob(byteArrays,{type:props.item.mimeType})
      console.log(blob);
      var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob, { type: props.item.mimeType });
    a.download = props.item.filename;
    document.body.appendChild(a);
    a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
    document.body.removeChild(a);
    //   const linkSource = `data:${props.item.attachment[0].mimeType};base64,${data.data}`;
    // const downloadLink = document.createElement('a');
    // document.body.appendChild(downloadLink);
    // downloadLink.href = linkSource;
    // downloadLink.target = '_self';
    // downloadLink.download = props.item.attachment[0].filename;
    // downloadLink.click();


  }
  function test(e){
    console.log(props.item);
  }
  return(
    <>
      <div onClick={test}style={{border:"1px solid black",margin:"4px",display:"inline-block"}}>
      <span><h3>{props.item.filename}</h3></span>
      <br></br>
      <button onClick={downloadAttachments}>Download</button>
      </div>
    </>

  )
}

export default Attachment
