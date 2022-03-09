import React, {useEffect, useState} from "react"
import AppRouter from "./Router"
import firebase from "../fBase"
import fBase from "../fBase";
import { authService, dbService } from "fBase";

function App() {
  const [initialized, setIntialized] = useState(false);
  const [userObject, setUserObject] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged(async (user) => {
      if(user){
        // const userData = await dbService.collection("likeCount").get();
        // userData.forEach(document => console.log(document.data()))
        // // console.log(userData.data())
        setUserObject({
          displayName: user.displayName ? user.displayName : `unknown_${Math.floor(Math.random()*100000)}`,
          photoURL: user.photoURL ? user.photoURL : "https://firebasestorage.googleapis.com/v0/b/twitter-firebase-4b55c.appspot.com/o/6uceNcllUwhk42n9N71mMOfiWx72%2FdefaultImages%2Fnoun_user.png?alt=media&token=6b0d9ac2-e578-422f-87db-cfcd0d2d1c83",
          uid: user.uid,
          likedData : [],
          updateProfile: (args) => user.updateProfile(args),
        });
        await dbService.collection(`profile`).doc(user.uid).set({displayName: user.displayName, photoURL:user.photoURL});
        const getLikeData = await dbService.collection("like").get();
        let isFirstLogin = true;
        getLikeData.forEach(element => {
          if(element.id === user.uid){
            isFirstLogin = false;
          }
        });
        if(isFirstLogin){
          await dbService.collection(`like`).doc(user.uid).set({likedData : []});
        }
      }else{
        Object(null);
      }
      setIntialized(true);
    })
  }, []);
  // 왜 userObject의 이름이 바로 반영되지 않는가. -> Profile에서 firebase 로직으로 불러온 displayName은 firebase에 연결이 되어 있지만
  // userObject.displayName은 react.js 데이터 이기 때문임. 다른 연결 방법이 필요함. 
  const refreshUser = async () => {
    const user = authService.currentUser;
    setUserObject({
      displayName: user.displayName,
      photoURL: user.photoURL ? user.photoURL : "https://firebasestorage.googleapis.com/v0/b/twitter-firebase-4b55c.appspot.com/o/6uceNcllUwhk42n9N71mMOfiWx72%2FdefaultImages%2Fnoun_user.png?alt=media&token=6b0d9ac2-e578-422f-87db-cfcd0d2d1c83",
      uid: user.uid,
      likedData : [],
      updateProfile: (args) => user.updateProfile(args),
    });
    await dbService.doc(`profile/${userObject.uid}`).update({displayName: user.displayName, photoURL:user.photoURL});
  }
  // console.log(authService.currentUser)
  // setInterval(() => {
  //   console.log(authService.currentUser)
  // }, 2000)
  return (
    <>
    {initialized ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObject)} userObject={userObject} /> : "loading..."}
    {/* <footer>&copy;minthing {new Date().getFullYear()}</footer> */}
    </>
  );
}

export default App;
