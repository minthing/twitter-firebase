import React, {useEffect, useState} from "react"
import AppRouter from "./Router"
import firebase from "../fBase"
import fBase from "../fBase";
import { authService } from "fBase";

function App() {
  const [initialized, setIntialized] = useState(false)
  const [isLoggedIn, setLoggedIn] = useState(authService.currentUser);
  const [userObject, setUserObject] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user){
        setLoggedIn(true);
        setUserObject(user);
      }else{
        setLoggedIn(false);
      }
      setIntialized(true);
    })
  }, [])
  // console.log(authService.currentUser)
  // setInterval(() => {
  //   console.log(authService.currentUser)
  // }, 2000)
  return (
    <>
    {initialized ? <AppRouter isLoggedIn={isLoggedIn} userObject={userObject} /> : "loading..."}
    <footer>&copy;minthing {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
