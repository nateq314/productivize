import React from "react";

import "./TodoDetailsPane.css";

export default ({ todo }) => {
  console.log(todo);
  return todo ? (
    <div id="TodoDetailsPane">
      <div id="detailsContainer">
        <form onSubmit={null}>
          <input className="content" value={todo.content} />
          <textarea className="description" value={todo.description || ""} />
        </form>
      </div>
    </div>
  ) : null;
};
