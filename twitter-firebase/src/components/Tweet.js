import { dbService } from "fBase";
import React, {useState} from "react"

const Tweet = ({tweetObject, isOwner}) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObject.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("진짜로 이 트윗을 지우실 겁니까?");
    if(ok){
      //delete tweet
      //너 충격적으로 쉽구나...?
      await dbService.doc(`tweets/${tweetObject.id}`).delete();
      console.log(ok)
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
  return (
    <div>
      {editing ? <><form onSubmit={onSubmitEdit}><input type="text" onChange={onChangeEdit} value={newTweet} required /><input type="submit" value="update tweet" /><button onClick={toggleEditing}>cancel</button></form></> :
      <>
      <p>{tweetObject.text}</p>
      <small>{tweetObject.createUser}</small>
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