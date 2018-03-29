import React from "react";

export default ({ user, logout }) => (
  <div id="Header">
    <h1>{user.first_name}'s To-do List</h1>
    <a id="logout" onClick={logout}>
      Log Out
    </a>
  </div>
);
