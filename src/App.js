import Header from "./partials/header"
import EBody from "./components/EBody"
import View from "./components/View"
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {

  //
  // const test=async()=>{
  //   var access=localStorage.getItem("token");
  //   var refresh=localStorage.getItem("token_2")
  //   var id=localStorage.getItem("UserId")
  //     await axios.get(`http://localhost:4000/gmail/v1/${id}`,{
  //       headers:{
  //         Authorization:`Bearer ${access}`,
  //         Refresh:`${refresh}`
  //       }
  //     }).then(res=>{
  //       console.log(res);
  //     }).catch(e=>{
  //       console.log(e);
  //     })
  // }
  return (
    <div className="App">
      <Header></Header>
      {
        (localStorage.getItem('token'))?
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<EBody/>}/>
            <Route exact path="/view" element={<View/>}/>
          </Routes>
        </BrowserRouter>
        :
        <h1>Please Login</h1>
      }
      {/*<button onClick={test}>Recieve</button>*/}
    </div>
  );
}

export default App;
