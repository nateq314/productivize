import React from "react";
import { Mutation } from "react-apollo";
import { FETCH_TODOS_QUERY, DELETE_TODO_QUERY } from "../queries";
import TrashAltRegular from "./svgs/faTrashAltRegular.svg";

export default ({ todo }) => (
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
    {(deleteTodo, { data }) => <TrashAltRegular className="todo-delete" onClick={deleteTodo} />}
  </Mutation>
);
