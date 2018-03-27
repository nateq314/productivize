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
          id="TodoInputForm"
          onSubmit={e => {
            e.preventDefault();
            createTodo({ variables: { content: input.value } });
            input.value = "";
          }}
        >
          <input
            id="todoInput"
            ref={node => {
              input = node;
            }}
            placeholder="Enter a new to-do"
          />
          <button type="submit">ADD</button>
        </form>
      )}
    </Mutation>
  );
};

export default TodoInput;
