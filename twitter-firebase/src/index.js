import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import firebase from "./fBase";
import "./styles.css";
import "./reset.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);