import React from "react";
import { Query } from "react-apollo";
import { FETCH_TODOS_QUERY, ADD_TODOS_SUBSCRIPTION } from "./queries";
import TodoList from "./components/TodoList";
import TodoInput from "./components/TodoInput";
import TodoFilter from "./components/TodoFilter";

import "./App.css";

export const FILTER_ALL = 0;
export const FILTER_UNCOMPLETED = 1;
export const FILTER_COMPLETED = 2;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: FILTER_ALL
    };
  }

  render() {
    return (
      <div id="App">
        <div id="header">
          <TodoInput />
          <TodoFilter filter={this.state.filter} onChange={this.filterOnChange.bind(this)} />
        </div>
        <Query query={FETCH_TODOS_QUERY}>
          {({ data, error, loading, subscribeToMore }) => {
            if (loading) return <div>Loading...</div>;
            if (error) return <div>Error :(</div>;
            return (
              <TodoList
                todos={data.todos}
                filter={this.state.filter}
                subscribeToNewTodos={() => {
                  subscribeToMore({
                    document: ADD_TODOS_SUBSCRIPTION,
                    variables: { user_id: 12 },
                    updateQuery(prev, { subscriptionData }) {
                      if (!subscriptionData.data) return prev;
                      const newTodo = subscriptionData.data.todoAdded;
                      return {
                        ...prev,
                        todos: [newTodo, ...prev.todos]
                      };
                    }
                  });
                }}
              />
            );
          }}
        </Query>
      </div>
    );
  }

  filterOnChange(filter) {
    this.setState({ filter });
  }
}
