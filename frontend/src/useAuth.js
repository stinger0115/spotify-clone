import { useState, useEffect } from "react";
import axios from "axios";

function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setrefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState(); 

  useEffect(() => {
    axios.post("http://localhost:3001/login", {
        code: code,
      })
        .then((res) => {
            setAccessToken(res.data.accessToken);
            setrefreshToken(res.data.refreshToken);
            setExpiresIn(res.data.expiresIn);

            //it will basically remove the code after getting the access token from search bar
            window.history.pushState({}, null, "/");
      })
      .catch(() => {
        window.location = "/";
      });
    }, [code]);
    



    //it will automatically refresh the token once the access token expires
    useEffect(() => {
        if (!refreshToken || !expiresIn) return;

        //so it will refresh the token just 1 min before the accesstoken expires
        const interval = setInterval(() => {
            
            axios
                .post("http://localhost:3001/refresh", {
                    refreshToken,
                })
                .then((res) => {
                    setAccessToken(res.data.accessToken);
                    setExpiresIn(res.data.expiresIn);
                })
              .catch((err) => {
                console.log("Error while Refreshing the token ", err); 
                    window.location = "/";
                });
        }, (expiresIn - 60) * 1000);

        return () => clearInterval(interval );
    }, [refreshToken,expiresIn]);
    
    return accessToken;
}

export default useAuth;
