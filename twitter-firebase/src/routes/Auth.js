import { authService, firebaseInstance } from "fBase";
import React, {useState} from "react";

const Auth =  () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("")
  const onChange = (event) => {
    const {target:{name, value}} = event;
    if(name === "email"){
      setEmail(value);
    }else if(name === "password"){
      setPassword(value);
    }
  }
  const onSubmit = async (event) => {
    event.preventDefault();
    try{
      let data;
      if(newAccount){
        data = await authService.createUserWithEmailAndPassword(
          email,password
        )
      }else{
        data = await authService.signInWithEmailAndPassword(email, password)
      }
      console.log(data);
    }catch(error){
      setError(error.message)
    }
  }
  const toggleAccount = () => {
    setNewAccount(prev => !prev)
  }
  const onSocialClick = async (event) => {
    console.log(event.target.name)
    const {target: {name}} = event;
    let provider
    if(name === "google"){
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    }else if(name === "github"){
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    let data = await authService.signInWithPopup(provider)
    console.log(data)
  }
  return(
    <div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} name="email" type="email" value={email} placeholder="example@example.com" required />
        <input onChange={onChange} name="password" type="password" value={password} placeholder="" required />
        <input type="submit" value={newAccount? "Create New Account" : "Log In"} required />
      </form>
      {error}
      <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create New Account"}
      </span>
      <div>
        <button onClick={onSocialClick} name="google"> continue with google </button>
        <button onClick={onSocialClick} name="github"> continue with github </button>
      </div>
    </div>
  )
}

export default Auth;