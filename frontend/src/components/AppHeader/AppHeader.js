// @flow

import React from "react";
import { Link } from "react-router-dom";
import { type User } from "../../App";

import "./AppHeader.css";

type AppHeaderProps = {
  user: User,
  logout: () => void
};

export default ({ user, logout }: AppHeaderProps) => (
  <div id="AppHeader">
    <h1>{user.first_name}'s To-do List</h1>
    <span id="menuItems">
      <Link to="/profile" id="user_name" className="menuItem">
        {user.first_name} {user.last_name}
      </Link>
      <Link id="home" to="/" className="menuItem">
        Home
      </Link>
      <a id="logout" onClick={logout} className="menuItem">
        Log Out
      </a>
    </span>
  </div>
);
