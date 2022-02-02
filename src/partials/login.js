import { GoogleLogin,GoogleLogout } from 'react-google-login';
const axios=require('axios')
export default function Login(){
  const login = async(response) => {
    console.log(response);
    if (response){
      await axios.post('http://localhost:4000/auth',{code:response},{
        withCredentials:true,
        headers:{'Access-Control-Allow-Origin': 'http://localhost:3000',
         'Content-Type': 'application/json',
         'Access-Control-Allow-Credentials':true
       }
     }).then(res=>{
       console.log(res);
       localStorage.setItem("token",res.data.access_token)
       localStorage.setItem("token_2",res.data.refresh_token)
       localStorage.setItem("UserId",res.data.userId)
       window.location.reload();
     })
      //setLog(true)
   };
    //setNewId(response)
  }
  const logout=()=>{
      localStorage.removeItem("token")
      localStorage.removeItem("token_2")
      localStorage.removeItem("UserId")
      window.location.reload();
      //setLog(false);
      console.log("Successfully Logged Out");
  }
  // const setNewId=(res)=>{
  //   let refresh_timing=(res.tokenObj.expires_in||3600-5*60)*1000;
  //   const refresh_token=async()=>{
  //     const newToken=await res.reloadAuthResponse();
  //     refresh_timing=(res.tokenObj.expires_in||3600-5*60)*1000;
  //     console.log('newAuthRes:',newToken);
  //     console.log('authToken', newToken.id_token);
  //     setTimeout(refresh_token,refresh_timing);
  //   }
  //   setTimeout(refresh_token,refresh_timing);
   //}
return(
  <>
      {
        (!localStorage.getItem('token'))?
      <GoogleLogin
        id="login"
        clientId="353081674923-nmsd7j08er63apkroqjcqdenufl3fuou.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={login}
        onFailure={login}
        prompt="consent"
        scope="profile email https://mail.google.com/"
        accessType='offline'
        responseType="code"
        cookiePolicy={'single_host_origin'}
        isSignIn={true}
      />
      :
      <GoogleLogout
      clientId="353081674923-nmsd7j08er63apkroqjcqdenufl3fuou.apps.googleusercontent.com"
      buttonText="Logout"
      onLogoutSuccess={logout}
      onFailure={logout}
      />
    }
    </>
)}
