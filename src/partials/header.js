import '../css/partials/header.css'
import '../css/js/search.js'
import  Login from './login'
const Header=(props)=>{
  return(
    <div className="container">
    {/*
      <div className="logo">
      <img src="./assets/logo.png" alt="logo"/>
      </div>*/
    }
      <div className="Title">
      <h1>Email Buddy</h1>
      <p>Access your Email's easily</p>
      </div>
      <div className="searchbar">
        <form className="search_form">
          <input id="text_field" type="text" placeholder="Search"></input>
          <div id="search_btn">
            <img src="./assets/search.png" alt="search_btn.png"/>
          </div>
        </form>
      </div>
      <div className="credentials">
      {/*Set components for login and Logout*/}
        <Login state={props}></Login>
      </div>
    </div>
  );
}
export default Header
