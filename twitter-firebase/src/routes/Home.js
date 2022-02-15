import { dbService, storageService } from "fBase";
import React, {useEffect, useState} from "react";
import Tweet from "components/Tweet";
import { v4 as uuidv4 } from 'uuid';

const Home = ({userObject}) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [image, setImage] = useState("");
  const getTweets = async () => {
    const tweetDatas = await dbService.collection("tweets").get();
    tweetDatas.forEach(document => {
      const tweetArray = {
        ...document.data(),
        id:document.id,
      }
      setTweets(prev => [tweetArray, ...prev])
      // prev는 기존의 값을 나타님 [최신 값, 이전 list의 값] -> 최신값+이전리스트의 값
      // setTweets(prev => [document.data(), ...prev])
    });
  }
  useEffect(()=>{
    getTweets();
    dbService.collection("tweets").onSnapshot(snapshot => {
      // 대체 얘가 아래 한 걸로 어떻게 우리가 원하는 방식으로 포맷된거임? 이해가 안가는데? -> data()라는 함수를 통해 변환시킨거임...
      // console.log(snapshot.docs[0].data()) snapshot.docs[0].data가 아니라 data()!!!
      const tweetArray = snapshot.docs.map(doc => ({id:doc.id, ...doc.data()}))
      setTweets(tweetArray);
    })
  }, [])

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
        createUser:userObject.uid,
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
  // console.log(tweets);
  return (
    <div>
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
      <div>
        {tweets.map((data) => 
          (<Tweet key={data.id} tweetObject={data} isOwner={data.createUser === userObject.uid}/>)
        )}
      </div>
    </div>
  )
}

export default Home;