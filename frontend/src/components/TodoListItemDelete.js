import React from "react";
import { Mutation } from "react-apollo";
import { DELETE_TODO_QUERY } from "../queries";
import TrashAltRegular from "./svgs/faTrashAltRegular.svg";

export default ({ todo }) => (
  <Mutation mutation={DELETE_TODO_QUERY} variables={{ id: todo.id }}>
    {(deleteTodo, { data }) => (
      <TrashAltRegular
        className="todo-delete"
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this to-do?")) {
            deleteTodo();
          }
        }}
      />
    )}
  </Mutation>
);
