import { dbService, storageService } from "fBase";
import React, {useState} from "react"

const Tweet = ({tweetObject, isOwner, userObject, refreshTweet, myTweets}) => {
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
  // let currentLikedId = [];
  // let currentUserLikedList = [];
  const onClickLike = async (event) => {
    let currentLikedNum = event.currentTarget.querySelector('span').innerHTML*1
    let currentTweetData = await dbService.doc(`tweets/${tweetObject.id}`).get();
    console.log(tweetObject.id);
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
    <div>
      <img className="profile_edit" src={userObject.photoURL} width="50" height="50" />
      {editing ? <><form onSubmit={onSubmitEdit}><input type="text" onChange={onChangeEdit} value={newTweet} required /><input type="submit" value="update tweet" /><button onClick={toggleEditing}>cancel</button></form></> :
      <>
      <p>{tweetObject.text}</p>
      {tweetObject.fileUrl && <img src={tweetObject.fileUrl} width="50px" height="50px" />}
      <button onClick={onClickLike}>♡ <span>{tweetObject.likeCount}</span></button>
      <small>{tweetObject.nickname}</small>
      {isOwner &&
        <>
          <button onClick={onDeleteClick}>Delete</button>
          <button onClick={toggleEditing}>Edit</button>
        </>
      }
      </>
    }
    </div>
  )
}

export default Tweet;