import React from "react";
import { Mutation } from "react-apollo";
import { UPDATE_TODO_QUERY } from "../../queries";

import "./TodoListItemContent.css";

function focusCaret(input) {
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
  const completedOn = todo.completedOn ? new Date(todo.completedOn) : null;
  let inputRef;

  return (
    <div className={`TodoListItemContent ${todo.completedOn ? "completed" : ""} ${todo.important ? "important" : ""}`}>
      <Mutation mutation={UPDATE_TODO_QUERY}>
        {(updateTodo, { data }) => (
          <form
            className={`edit-todo ${isEditing ? "isEditing" : ""}`}
            onSubmit={e => {
              e.preventDefault();
              updateTodo({ variables: { id: todo.id, content: inputRef.value } });
              endEdit();
            }}
          >
            <input
              autoFocus
              readOnly={isEditing ? false : true}
              defaultValue={todo.content}
              ref={node => {
                inputRef = node;
              }}
              onBlur={() => {
                inputRef.value = todo.content;
                endEdit();
              }}
              onKeyDown={e => {
                if (e.keyCode === 27) {
                  inputRef.value = todo.content;
                  endEdit();
                }
              }}
              onDoubleClick={() => {
                if (!todo.completedOn && !isEditing) {
                  beginEdit();
                  focusCaret(inputRef);
                }
              }}
            />
          </form>
        )}
      </Mutation>
      {todo.completedOn && <div className="todo-completedOn">Completed on {prettyDate(completedOn)}</div>}
    </div>
  );
};
