// @flow

import React from "react";
import { Mutation } from "react-apollo";
import { CREATE_TODO_QUERY } from "../../queries";
import { type User } from "../../App";

import "./TodoInput.css";

type TodoInputProps = {
  user: User
};

const TodoInput = ({ user }: TodoInputProps) => {
  let input: ?HTMLInputElement;

  return (
    <Mutation mutation={CREATE_TODO_QUERY} variables={{ user_id: user.id }}>
      {(createTodo, { data }) => (
        <form
          id="TodoInputForm"
          onSubmit={e => {
            if (input) {
              e.preventDefault();
              createTodo({ variables: { user_id: user.id, content: input.value } });
              input.value = "";
            }
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
