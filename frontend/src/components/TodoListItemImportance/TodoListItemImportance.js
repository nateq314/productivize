// @flow

import React from "react";
import { Mutation } from "react-apollo";
import { UPDATE_TODO_QUERY } from "../../queries";
import StarLight from "../svgs/faStarLight.svg.js";
import StarSolid from "../svgs/faStarSolid.svg.js";
import { type Todo } from "../TodoList/TodoList";

import "./TodoListItemImportance.css";

type TodoListItemImportanceProps = {
  todo: Todo
};

export default ({ todo }: TodoListItemImportanceProps) => (
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
