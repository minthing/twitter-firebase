import { authService } from "fBase";
import React, {useState} from "react";

const AuthForm = () =>{
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
      // console.log(data);
    }catch(error){
      setError(error.message)
    }
  }
  const toggleAccount = () => {
    setNewAccount(prev => !prev)
  }

  return (
  <>
    <form onSubmit={onSubmit} className="form_email">
      <input class="input_email" onChange={onChange} name="email" type="email" value={email} placeholder="example@example.com" required />
      <input class="input_password" onChange={onChange} name="password" type="password" value={password} placeholder="" required />
      <input class="toggle_email" type="submit" value={newAccount? "Create New Account" : "Log In"} required />
    </form>
    {error && <div class="login_error">{error}</div>}
    <span class="toggle_message" onClick={toggleAccount}>
      {newAccount ? "I already have an account" : "Create New Account"}
    </span>
  </>
  )
}

export default AuthForm;