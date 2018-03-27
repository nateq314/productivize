import React from "react";
import { Mutation } from "react-apollo";
import { CREATE_TODO_QUERY, FETCH_TODOS_QUERY } from "../queries";

const TodoInput = props => {
  let input;

  return (
    <Mutation
      mutation={CREATE_TODO_QUERY}
      update={(cache, { data: { createTodo } }) => {
        const { todos } = cache.readQuery({ query: FETCH_TODOS_QUERY });
        cache.writeQuery({
          query: FETCH_TODOS_QUERY,
          data: { todos: todos.concat([createTodo]) }
        });
      }}
    >
      {(createTodo, { data }) => (
        <form
          id="TodoInput"
          onSubmit={e => {
            e.preventDefault();
            createTodo({ variables: { content: input.value } });
            input.value = "";
          }}
        >
          <label htmlFor="todoInput">Enter a new one: </label>
          <input
            id="todoInput"
            ref={node => {
              input = node;
            }}
          />
          <button type="submit">Create To-do</button>
        </form>
      )}
    </Mutation>
  );
};

export default TodoInput;
