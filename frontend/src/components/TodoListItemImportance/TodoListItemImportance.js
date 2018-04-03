import React from "react";
import { Mutation } from "react-apollo";
import { UPDATE_TODO_QUERY } from "../../queries";
import StarLight from "../svgs/faStarLight.svg";
import StarSolid from "../svgs/faStarSolid.svg";

import "./TodoListItemImportance.css";

export default ({ todo }) => (
  <Mutation mutation={UPDATE_TODO_QUERY}>
    {(updateTodo, { data }) =>
      todo.important ? (
        <StarSolid
          className="todo-importance"
          onClick={() => {
            updateTodo({ variables: { id: todo.id, important: !todo.important } });
          }}
        />
      ) : (
        <StarLight
          className="todo-importance"
          onClick={() => {
            updateTodo({ variables: { id: todo.id, important: !todo.important } });
          }}
        />
      )
    }
  </Mutation>
);
