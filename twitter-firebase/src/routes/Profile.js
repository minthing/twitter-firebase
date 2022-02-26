import { authService, dbService, storageService } from "fBase";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Tweet from "components/Tweet";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'

export default ({userObject, refreshUser}) => {
  // console.log(userObject)
  const defaultImage = "https://firebasestorage.googleapis.com/v0/b/twitter-firebase-4b55c.appspot.com/o/6uceNcllUwhk42n9N71mMOfiWx72%2FdefaultImages%2Fnoun_user.png?alt=media&token=6b0d9ac2-e578-422f-87db-cfcd0d2d1c83"
  // 이미 있는 내용이니까 빈 칸이 아니라 userObject에서 가져오는 게 맞겠구나...
  const [nickname, setNickname] = useState(userObject.displayName);
  const [myTweets, setMyTweets] = useState([]);
  const [likedTweets, setLikedTweets] = useState([]);
  const history = useHistory();
  const [profileImage, setProfileImage] = useState(userObject.photoURL ? userObject.photoURL : defaultImage)
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
      tweets.forEach(document => {
        const tweetArray = {
          ...document.data(),
          id:document.id,
        }
        setMyTweets(prev => [tweetArray, ...prev])
      })
  };

  const refreshMyTweets = async() => {
    let tempArray = [];
    setMyTweets([]);
    const tweets = await dbService
    .collection("tweets")
    .where("createUser", "==", userObject.uid)
    .orderBy("createdAt", "desc")
    .get();
    tweets.forEach(document => {
      const tweetArray = {
        ...document.data(),
        id:document.id,
      }
      tempArray.push(tweetArray);
    })
    // console.log(tempArray)
    setMyTweets(tempArray);
  }

  const getLikedTweets = async () => {
    const likeData = await dbService
      .doc(`like/${userObject.uid}`)
      .get();
    const myLike = likeData.data().likedData;
    if(myLike){
      myLike.forEach(async (element, index) => {
        const tweets = await dbService
        .doc(`tweets/${element}`)
        .get();
        const tweetArray = {
          ...tweets.data(),
          id:tweets.id
        }
        setLikedTweets(prev => [tweetArray, ...prev])
      });
    }
  }

  const refreshLikedTweets = async() => {
    let tempArray = [];
    setLikedTweets([])
    const likeData = await dbService
      .doc(`like/${userObject.uid}`)
      .get();
        const myLike = likeData.data().likedData;
        myLike.forEach(async (element, index) => {
          const tweets = await dbService
          .doc(`tweets/${element}`)
          .get();
          const tweetArray = {
            ...tweets.data(),
            id:tweets.id
          }
          setLikedTweets(prev => [tweetArray, ...prev]);
        });
  }

  function refreshTweet(){
    refreshMyTweets();
    refreshLikedTweets();
    // setTimeout(()=>{  }, 1000);
  }

  const onChange = (event) =>{
    const {target:{value}} = event;
    setNickname(value)
  }

  const onSubmit = async (event) =>{
    event.preventDefault();
    let fileUrl = profileImage;
      // displayName & photoUrl을 바꿀 수 있음
      if((profileImage !== defaultImage) || (userObject.displayName !== nickname)){
        const fileReference = storageService.ref().child(`${userObject.uid}/profile_image`);
        const response = await fileReference.putString(profileImage, "data_url");
        fileUrl = await response.ref.getDownloadURL();
        console.log(fileUrl)
      }
      await userObject.updateProfile({
        displayName: nickname,
        photoUrl: fileUrl
      });
      refreshUser();
  }

  const onFileChange = (event) => {
    // 처음 알았음!!
    const {target : {files}} = event;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      // console.log(finishedEvent);
      const {currentTarget : {result}} = finishedEvent;
      setProfileImage(result);
      // console.log(result);
    };
    // 이름이 너무 길어서 안된다네...ㅋㅋ..
    reader.readAsDataURL(file);
  }
  const deletePhoto = () => setProfileImage(defaultImage);

  useEffect(() => {
    getMyTweets();
    getLikedTweets();
  }, []);
  return(
    <div className="wrap_profile">
      <h3 className="title">Change Profile</h3>
      <div class="wrap_change_profile">
      <div className="wrap_profile_current">
        <img src={profileImage} className="current_profile" width="50px" height="50px" />
        {profileImage !== defaultImage && <button className="delete_photo_btn" onClick={deletePhoto}>❌</button>}
      </div>
      <form className="profile_change_form" onSubmit={onSubmit}>
      <FontAwesomeIcon
        icon={faImage}
        color={"#a29bfe"}
        size="2x"
        style={{ position:"absolute", zIndex:-10, fontSize:25, marginTop:10 }}
      />
        <input className="input_tweet_image" onChange={onFileChange} type="file" accept="image/*"/>
        <input className="input_new_nickname" onChange={onChange} value={nickname} type="text" placeholder="new nickname" />
        <input className="input_tweet_btn" type="submit" value="update profile" />
      </form>
      </div>
      <button onClick={onLogOutClick}>Log Out</button>
      <h3 className="title">My Tweets</h3>
      <div>
        {myTweets.map((data) => 
          (<Tweet key={data.id} tweetObject={data} userObject={userObject} myTweets={true} refreshTweet={refreshTweet} isOwner={data.createUser === userObject.uid}/>)
        )}
      </div>
      <h3 className="title">Liked Tweets</h3>
      <div>
        {likedTweets.map((data) => 
          (<Tweet key={data.id} tweetObject={data} userObject={userObject} myTweets={true} refreshTweet={refreshTweet} isOwner={data.createUser === userObject.uid}/>)
        )}
      </div>
    </div>
  )
}