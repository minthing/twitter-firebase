import React from "react";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faHouseChimney, faUser } from '@fortawesome/free-solid-svg-icons'
import {
  faTwitter
} from "@fortawesome/free-brands-svg-icons";
const Navigation = ({userObject}) => <nav className="wrap_nav">
  <FontAwesomeIcon
    className="twitter_icon"
    icon={faTwitter}
    color={"#a29bfe"}
    size="3x"
    style={{ display:"block", width:"100%", margin:"40px 0", textAlign:"center" }}/>
  <ul className="list_nav">
    <li><Link to="/"><FontAwesomeIcon icon={faHouseChimney} color={"#a29bfe"} size="2x" /><span className="nav_text">Home</span></Link></li>
    <li><Link to="/profile"><img className="profile_img" src={userObject.photoURL} width="36" height="36" /><span className="nav_text">Profile</span></Link></li>
  </ul>
</nav>

export default Navigation;