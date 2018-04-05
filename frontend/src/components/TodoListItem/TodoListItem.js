import React from "react";
import TodoListItemImportance from "../TodoListItemImportance/TodoListItemImportance";
import TodoListItemContent from "../TodoListItemContent/TodoListItemContent";
import TodoListItemCompleted from "../TodoListItemCompleted/TodoListItemCompleted";

import "./TodoListItem.css";

export default ({ todo, isEditing, beginEdit, endEdit, setContextMenu }) => (
  <li
    className={`TodoListItem`}
    onContextMenu={e => {
      setContextMenu(e, todo.id);
      e.stopPropagation();
    }}
  >
    <TodoListItemCompleted todo={todo} />
    <TodoListItemContent beginEdit={beginEdit} endEdit={endEdit} isEditing={isEditing === todo.id} todo={todo} />
    <div className="todo-option-icons">
      <TodoListItemImportance todo={todo} />
    </div>
  </li>
);
