import React from "react";
import { Mutation } from "react-apollo";
import { FETCH_TODOS_QUERY, DELETE_TODO_QUERY, UPDATE_TODO_QUERY } from "../queries";

function editOnFocus(e) {
  const input = e.currentTarget;
  input.selectionStart = input.selectionEnd = input.value.length;
}

const TodoListItem = ({ todo, idx, isEditing, beginEdit, endEdit }) => {
  let inputRef;

  return (
    <li className="TodoListItem">
      <Mutation mutation={UPDATE_TODO_QUERY}>
        {(updateTodo, { data }) => (
          <span
            className={`importance ${todo.important ? "important" : "unimportant"}`}
            onClick={() => {
              updateTodo({ variables: { id: todo.id, important: !todo.important } });
            }}
          >
            !!!
          </span>
        )}
      </Mutation>
      {isEditing === todo.id ? (
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
        <span className="todo-content" onDoubleClick={beginEdit}>
          {todo.content}
        </span>
      )}
      <Mutation
        mutation={DELETE_TODO_QUERY}
        variables={{ id: todo.id }}
        update={(cache, { data: { deleteTodo } }) => {
          const { todos } = cache.readQuery({ query: FETCH_TODOS_QUERY });
          cache.writeQuery({
            query: FETCH_TODOS_QUERY,
            data: {
              todos: todos.filter(todo => todo.id !== deleteTodo.id)
            }
          });
        }}
      >
        {(deleteTodo, { data }) => (
          <span className="deleteTodo" onClick={deleteTodo}>
            DELETE
          </span>
        )}
      </Mutation>
    </li>
  );
};

export default TodoListItem;
