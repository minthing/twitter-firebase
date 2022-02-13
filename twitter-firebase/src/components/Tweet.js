import React from "react"

const Tweet = ({tweetObject, isOwner}) => (
  <div>
    <p>{tweetObject.text}</p>
    <small>{tweetObject.createUser}</small>
    {isOwner &&
    <>
      <button>Delete</button>
      <button>Edit</button>
    </>
    }
  </div>
)

export default Tweet;