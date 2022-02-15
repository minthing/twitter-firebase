import React, {useEffect, useState} from "react"
import AppRouter from "./Router"
import firebase from "../fBase"
import fBase from "../fBase";
import { authService } from "fBase";

function App() {
  const [initialized, setIntialized] = useState(false);
  const [userObject, setUserObject] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user){
        setUserObject({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      }else{
        setUserObject(null);
      }
      setIntialized(true);
    })
  }, []);
  // 왜 userObject의 이름이 바로 반영되지 않는가. -> Profile에서 firebase 로직으로 불러온 displayName은 firebase에 연결이 되어 있지만
  // userObject.displayName은 react.js 데이터 이기 때문임. 다른 연결 방법이 필요함. 
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObject({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  }
  // console.log(authService.currentUser)
  // setInterval(() => {
  //   console.log(authService.currentUser)
  // }, 2000)
  return (
    <>
    {initialized ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObject)} userObject={userObject} /> : "loading..."}
    <footer>&copy;minthing {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
