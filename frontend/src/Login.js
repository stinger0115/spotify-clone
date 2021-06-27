import React from "react";
import './Login.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


const auth_url =
  "https://accounts.spotify.com/authorize?client_id=b4600204fc574bbb8c17cd3efe063665&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-recently-played%20user-top-read";


//https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg

function Login() {
  return (
    <div className="login">
      
      <img className="img-fluid" src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg" alt="spotify_logo"/>
      
      <a className="login_link btn-lg" href={auth_url}>Login to Spotify</a>
    </div>
  );
}

export default Login;
