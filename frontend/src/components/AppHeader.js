import React from "react";
import { Link } from "react-router-dom";

export default ({ user, logout }) => (
  <div id="AppHeader">
    <h1>{user.first_name}'s To-do List</h1>
    <span id="menuItems">
      <span id="user_name" className="menuItem">
        {user.first_name} {user.last_name}
      </span>
      <Link id="home" to="/" className="menuItem">
        Home
      </Link>
      <Link id="profile" to="/profile" className="menuItem">
        Profile
      </Link>
      <a id="logout" onClick={logout} className="menuItem">
        Log Out
      </a>
    </span>
  </div>
);
