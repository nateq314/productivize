// @flow
import React from "react";
import { Query } from "react-apollo";
import { FETCH_TODOS_QUERY, UPDATE_TODOS_SUBSCRIPTION } from "../../queries";
import TodoList, { type Todo } from "../../components/TodoList/TodoList";

type User = {
  id: number,
  first_name: string,
  last_name: string,
  email: string
};

type HomeProps = {
  user: User,
  contextMenu: number,
  setContextMenu: (e: SyntheticEvent<HTMLLIElement>, todoID: number) => void
};

type QueryChildrenProps = {
  data: {
    todos: Todo[]
  },
  error: any,
  loading: boolean,
  subscribeToMore: any => void
};

type TodosUpdateSubscriptionResponse = {
  subscriptionData: {
    data: {
      todosUpdate: {
        todoAdded?: Todo,
        todoUpdated?: Todo,
        todoDeleted?: Todo
      }
    }
  }
};

export default ({ user, contextMenu, setContextMenu }: HomeProps) => (
  <div id="Home">
    <Query query={FETCH_TODOS_QUERY} variables={{ user_id: user.id }}>
      {({ data, error, loading, subscribeToMore }: QueryChildrenProps) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error :(</div>;
        return (
          <TodoList
            contextMenu={contextMenu}
            setContextMenu={setContextMenu}
            todos={data.todos}
            user={user}
            subscribeToTodoUpdates={() => {
              subscribeToMore({
                document: UPDATE_TODOS_SUBSCRIPTION,
                variables: { user_id: user.id },
                updateQuery(prev, { subscriptionData }: TodosUpdateSubscriptionResponse) {
                  if (!subscriptionData.data) return prev;
                  const { todoAdded, todoUpdated, todoDeleted } = subscriptionData.data.todosUpdate;
                  if (todoAdded) {
                    return {
                      ...prev,
                      todos: [todoAdded, ...prev.todos]
                    };
                  }
                  if (todoUpdated) {
                    const idx = prev.todos.findIndex(todo => todo.id === todoUpdated.id);
                    return {
                      ...prev,
                      todos: [...prev.todos.slice(0, idx), todoUpdated, ...prev.todos.slice(idx + 1)]
                    };
                  }
                  if (todoDeleted) {
                    const idx = prev.todos.findIndex(todo => todo.id === todoDeleted.id);
                    return {
                      ...prev,
                      todos: [...prev.todos.slice(0, idx), ...prev.todos.slice(idx + 1)]
                    };
                  }
                }
              });
            }}
          />
        );
      }}
    </Query>
  </div>
);
