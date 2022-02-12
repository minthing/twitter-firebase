import React, {useState} from "react"
import AppRouter from "./Router"
import firebase from "../fBase"
import fBase from "../fBase";
import { authService } from "fBase";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(authService.currentUser);
  return (
    <>
    <AppRouter isLoggedIn={isLoggedIn} />
    <footer>&copy;minthing {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
