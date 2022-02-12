import React, {useState} from "react";

const Auth =  () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const onChange = (event) => {
    const {target:{name, value}} = event;
    if(name == email){
      setEmail(value)
    }else if(name == password){
      setPassword(value)
    }
  }
  const onSubmit = (event) => {
    event.preventDefault();
  }
  return(
    <div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} name="email" type="email" placeholder="example@example.com" required />
        <input onChange={onChange} name="password" type="password" placeholder="" required />
        <input type="submit" value="login" required />
      </form>
      <div>
        <button> continue with google </button>
        <button> continue with github </button>
      </div>
    </div>
  )
}

export default Auth;