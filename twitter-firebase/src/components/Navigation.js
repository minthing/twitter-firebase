import React from "react";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faHouseChimney, faUser } from '@fortawesome/free-solid-svg-icons'

const Navigation = ({userObject}) => <nav>
  <ul className="list_nav">
    <li><Link to="/"><FontAwesomeIcon icon={faHouseChimney} color={"#a29bfe"} size="2x" /></Link></li>
    <li><Link to="/profile"><FontAwesomeIcon icon={faUser} color={"#a29bfe"} size="2x" /></Link></li>
  </ul>
</nav>

export default Navigation;