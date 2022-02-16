import { authService, firebaseInstance } from "fBase";
import React, {useState} from "react";
import AuthForm from "components/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Auth =  () => {
  const onSocialClick = async (event) => {
    // console.log(event.target.name)
    const {target: {name}} = event;
    let provider
    if(name === "google"){
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    }else if(name === "github"){
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    let data = await authService.signInWithPopup(provider)
    // console.log(data)
  }
  return(
    <div className="cont_auth">
      <div class="wrap_login">
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#a29bfe"}
        size="3x"
        style={{ marginBottom: 30, width:"100%", textAlign:"center" }}
        
      />
      <AuthForm />
      <div className="wrap_social">
        <button className="google" onClick={onSocialClick} name="google"><span><FontAwesomeIcon icon={faGoogle} /></span> GOOGLE</button>
        <button className="github" onClick={onSocialClick} name="github"><span><FontAwesomeIcon icon={faGithub} /></span> GITHUB</button>
      </div>
      </div>
    </div>
  )
}

export default Auth;