import React from "react";
import { Mutation } from "react-apollo";
import { UPDATE_TODO_QUERY } from "../queries";

export default ({ todo }) => (
  <Mutation mutation={UPDATE_TODO_QUERY}>
    {(updateTodo, { data: mutationResult }) => {
      return (
        <input
          type="checkbox"
          className="todo-completed"
          onChange={e => {
            updateTodo({ variables: { id: todo.id, completedOn: e.currentTarget.checked ? Date.now() : null } });
          }}
          checked={todo.completedOn ? true : false}
        />
      );
    }}
  </Mutation>
);
