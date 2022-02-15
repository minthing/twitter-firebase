import { authService, dbService } from "fBase";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export default ({userObject, refreshUser}) => {
  // 이미 있는 내용이니까 빈 칸이 아니라 userObject에서 가져오는 게 맞겠구나...
  const [nickname, setNickname] = useState(userObject.displayName);
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  }
  // 색인을... firebase 가서 만들어야 하는구나...! 신기하다!!!!
  const getMyTweets = async () => {
    const tweets = await dbService
      .collection("tweets")
      .where("createUser", "==", userObject.uid)
      .orderBy("createdAt", "desc")
      .get();
    console.log(tweets.docs.map((doc) => doc.data()));
  };

  const onChange = (event) =>{
    const {target:{value}} = event;
    setNickname(value)
  }

  const onSubmit = async (event) =>{
    event.preventDefault();
    if(userObject.displayName !== nickname){
      // displayName & photoUrl을 바꿀 수 있음
      await userObject.updateProfile({
        displayName: nickname,
      });
      refreshUser();
    }
  }

  useEffect(() => {
    getMyTweets();
  }, []);
  return(
    <>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} value={nickname} type="text" placeholder="new nickname" />
        <input type="submit" value="update profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}