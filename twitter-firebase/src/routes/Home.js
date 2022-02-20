import { dbService, storageService } from "fBase";
import React, {useEffect, useState} from "react";
import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";

const Home = ({userObject}) => {
  const [tweets, setTweets] = useState([]);
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
  // console.log(tweets);
  return (
    <div className="wrap_home">
      <h3 className="title">Home</h3>
      <TweetFactory userObject={userObject} />
      <div>
        {tweets.map((data) => 
          (<Tweet key={data.id} myTweets={false} tweetObject={data} userObject={userObject} isOwner={data.createUser === userObject.uid}/>)
        )}
      </div>
    </div>
  )
}

export default Home;