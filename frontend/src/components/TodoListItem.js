import React from "react";
import TodoListItemImportance from "./TodoListItemImportance";
import TodoListItemContent from "./TodoListItemContent";
import TodoListItemDelete from "./TodoListItemDelete";
import TodoListItemCompleted from "./TodoListItemCompleted";

const TodoListItem = ({ todo, idx, isEditing, beginEdit, endEdit }) => {
  return (
    <li className={`TodoListItem ${todo.completedOn ? "completed" : ""} ${todo.important ? "important" : ""}`}>
      <TodoListItemCompleted todo={todo} />
      <TodoListItemContent beginEdit={beginEdit} endEdit={endEdit} isEditing={isEditing} todo={todo} />
      <div className="todo-option-icons">
        <TodoListItemImportance todo={todo} />
        <TodoListItemDelete todo={todo} />
      </div>
    </li>
  );
};

export default TodoListItem;
