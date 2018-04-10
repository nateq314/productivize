import React from "react";

import "./TodoDetailsPane.css";

export default ({ todo }) => (
  <div id="TodoDetailsPane">
    <div id="detailsContainer">
      <div className="content">{todo && todo.content}</div>
    </div>
  </div>
);
