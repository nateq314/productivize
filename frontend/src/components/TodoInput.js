import React from "react";
import { Mutation } from "react-apollo";
import { CREATE_TODO_QUERY } from "../queries";

const TodoInput = ({ user }) => {
  let input;

  return (
    <Mutation mutation={CREATE_TODO_QUERY} variables={{ user_id: user.id }}>
      {(createTodo, { data }) => (
        <form
          id="TodoInputForm"
          onSubmit={e => {
            e.preventDefault();
            createTodo({ variables: { user_id: user.id, content: input.value } });
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
