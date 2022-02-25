import { dbService, storageService } from "fBase";
import React, {useState} from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis, faHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'

const Tweet = ({tweetObject, isOwner, userObject, refreshTweet, myTweets}) => {
  const [isActive, setIsActive] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObject.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("진짜로 이 트윗을 지우실 겁니까?");
    if(ok){
      //delete tweet
      //너 충격적으로 쉽구나...?
      await dbService.doc(`tweets/${tweetObject.id}`).delete();
      // 하루도 안쉬었는데 고작 14시간 지났다고 여기서 삭제한다는 것도 까먹기 있음?
      await storageService.refFromURL(tweetObject.fileUrl).delete();
      // console.log(ok)
    }
  }
  const toggleEditing = () => {
    setEditing((prev) => !prev);
  }
  const onSubmitEdit = async (event) => {
    event.preventDefault();
    await dbService.doc(`tweets/${tweetObject.id}`).update({text:newTweet});
    toggleEditing();
  }
  const onChangeEdit = (event) => {
    const {target: {value}} = event;
    setNewTweet(value);
  }
  const toggleButton = () => {
    setIsActive(!isActive);
  }
  // let currentLikedId = [];
  // let currentUserLikedList = [];
  const onClickLike = async (event) => {
    let currentLikedNum = event.currentTarget.querySelector('span').innerHTML*1
    let currentTweetData = await dbService.doc(`tweets/${tweetObject.id}`).get();
    let currentLikedId = await currentTweetData.data().likedId;
    let currentUserLikedList = await (await dbService.doc(`like/${userObject.uid}`).get()).data().likedData;
    if(currentLikedId.indexOf(userObject.uid) === -1){
      currentLikedId.push(userObject.uid);
      currentUserLikedList.push(tweetObject.id)
      await dbService.doc(`tweets/${tweetObject.id}`).update({likedId : currentLikedId});
      await dbService.doc(`tweets/${tweetObject.id}`).update({likeCount : currentLikedNum +1});
      await dbService.doc(`like/${userObject.uid}`).update({likedData : currentUserLikedList});
    }else{
      const sliceCount = currentLikedId.indexOf(userObject.uid);
      const currentTweetCount = currentLikedId.indexOf(tweetObject.id);
      currentLikedId.splice(sliceCount, 1);
      currentUserLikedList.splice(currentTweetCount, 1);
      await dbService.doc(`tweets/${tweetObject.id}`).update({likedId : currentLikedId});
      await dbService.doc(`tweets/${tweetObject.id}`).update({likeCount : currentLikedNum - 1});
      await dbService.doc(`like/${userObject.uid}`).update({likedData : currentUserLikedList});
    }
    if(myTweets){
      refreshTweet();
    }
  }
  return (
    <div className="tweet">
      <img className="profile_img" src={userObject.photoURL} width="42" height="42" />
      {editing ? <><form onSubmit={onSubmitEdit}><input type="text" onChange={onChangeEdit} value={newTweet} required /><input type="submit" value="update tweet" /><button onClick={toggleEditing}>cancel</button></form></> :
      <div className="wrap_tweet_text">
        <div className="wrap_title">
      <div className="nickname">{userObject.displayName}</div>
      {isOwner &&
      <>
        <div onClick={toggleButton} className="icon_toggle"><FontAwesomeIcon style={{color:"#777"}} icon={faEllipsis} /></div>
        <div className={isActive ? "active wrap_button" : "wrap_button"}>
          <button className="btn_delete" onClick={onDeleteClick}>Delete</button>
          <button className="btn_edit" onClick={toggleEditing}>Edit</button>
        </div>
      </>
      }
      </div>
      {tweetObject.text !=="" && <span className="tweet_text">{tweetObject.text}</span>}
      {tweetObject.fileUrl && <img className="tweet_img" src={tweetObject.fileUrl} />}
      <button className="like" onClick={onClickLike}><FontAwesomeIcon style={{color:"#777", marginRight:5}} icon={tweetObject.id === userObject.likedData ? faHeart : faHeartRegular} /><span>{tweetObject.likeCount}</span></button>
      </div>
    }
    </div>
  )
}

export default Tweet;