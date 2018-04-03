import React from "react";
import { Mutation } from "react-apollo";
import { UPDATE_TODO_QUERY } from "../../queries";

import "./TodoListItemContent.css";

function editOnFocus(e) {
  const input = e.currentTarget;
  input.selectionStart = input.selectionEnd = input.value.length;
}

function prettyDate(date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return (
    daysOfTheWeek[date.getDay()] + " " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
  );
}

export default ({ beginEdit, endEdit, isEditing, todo }) => {
  let inputRef;
  const completedOn = todo.completedOn ? new Date(todo.completedOn) : null;

  return isEditing === todo.id ? (
    <Mutation mutation={UPDATE_TODO_QUERY}>
      {(updateTodo, { data }) => (
        <form
          className="edit-todo"
          onSubmit={e => {
            e.preventDefault();
            updateTodo({ variables: { id: todo.id, content: inputRef.value } });
            endEdit();
          }}
        >
          <input
            autoFocus
            defaultValue={todo.content}
            ref={node => {
              inputRef = node;
            }}
            onBlur={endEdit}
            onFocus={editOnFocus}
            onKeyDown={e => {
              if (e.keyCode === 27) {
                endEdit();
              }
            }}
          />
        </form>
      )}
    </Mutation>
  ) : (
    <span className="todo-main">
      <div className="todo-content" onDoubleClick={todo.completedOn ? null : beginEdit}>
        {todo.content}
      </div>
      {todo.completedOn && <div className="todo-completedOn">Completed on {prettyDate(completedOn)}</div>}
    </span>
  );
};
