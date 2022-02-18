import { dbService, storageService } from "fBase";
import React, {useState} from "react";
import { v4 as uuidv4 } from 'uuid';

const TweetFactory = ({userObject}) => {
  const [tweet, setTweet] = useState("");
  const [image, setImage] = useState("");

  const onSubmit= async (event) => {
    event.preventDefault();
    if(tweet !== "" || image){
      let fileUrl = ""
      if(image){
        const fileReference = storageService.ref().child(`${userObject.uid}/${uuidv4()}`);
        const response = await fileReference.putString(image, "data_url");
        fileUrl = await response.ref.getDownloadURL();
      }
      const innerData = {
        text:tweet,
        createdAt:Date.now(),
        likeCount: 0,
        likedId:[],
        createUser:userObject.uid,
        nickname: userObject.displayName,
        fileUrl
      }
      await dbService.collection("tweets").add(innerData);
      setTweet("");
      setImage("");
    }else{
      alert("트윗을 채워주세요!");
    }
  }

  const onChange = (event) => {
    const {target : {value}} = event;
    setTweet(value)
  }
  const onFileChange = (event) => {
    // 처음 알았음!!
    const {target : {files}} = event;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      // console.log(finishedEvent);
      const {currentTarget : {result}} = finishedEvent;
      setImage(result);
    };
    reader.readAsDataURL(file);
  }
  const deletePhoto = () => setImage(null);

  return (
    <form onSubmit={onSubmit}>
    <input value={tweet} onChange={onChange} type="text" placeholder="무슨 일이 일어나고 있나요?" maxLength={140} />
    <input onChange={onFileChange} type="file" accept="image/*"/>
    <input type="submit" value="tweet"/>
    {image && (
    <div>
      <img src={image} width="50px" height="50px" />
      <button onClick={deletePhoto}>❌</button>
    </div>
    )
    }
  </form>
  )
}

export default TweetFactory;