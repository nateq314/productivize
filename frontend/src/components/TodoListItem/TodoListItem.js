import React from "react";
import TodoListItemImportance from "../TodoListItemImportance/TodoListItemImportance";
import TodoListItemContent from "../TodoListItemContent/TodoListItemContent";
import TodoListItemDelete from "../TodoListItemDelete/TodoListItemDelete";
import TodoListItemCompleted from "../TodoListItemCompleted/TodoListItemCompleted";

import "./TodoListItem.css";

export default ({ todo, isEditing, beginEdit, endEdit, toggleContextMenu }) => (
  <li
    className={`TodoListItem`}
    onContextMenu={e => {
      toggleContextMenu(e, todo.id);
    }}
  >
    <TodoListItemCompleted todo={todo} />
    <TodoListItemContent beginEdit={beginEdit} endEdit={endEdit} isEditing={isEditing === todo.id} todo={todo} />
    <div className="todo-option-icons">
      <TodoListItemImportance todo={todo} />
      <TodoListItemDelete todo={todo} />
    </div>
  </li>
);
