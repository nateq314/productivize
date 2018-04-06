// @flow

import React from "react";
import TodoListItemImportance from "../TodoListItemImportance/TodoListItemImportance";
import TodoListItemContent from "../TodoListItemContent/TodoListItemContent";
import TodoListItemCompleted from "../TodoListItemCompleted/TodoListItemCompleted";
import { type Todo } from "../TodoList/TodoList";

import "./TodoListItem.css";

type TodoListItemProps = {
  todo: Todo,
  isEditing: ?number,
  beginEdit: () => void,
  endEdit: () => void,
  setContextMenu: (SyntheticMouseEvent<HTMLLIElement>, number) => void
};

export default ({ todo, isEditing, beginEdit, endEdit, setContextMenu }: TodoListItemProps) => (
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
