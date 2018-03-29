import React from "react";
import { Query } from "react-apollo";
import { FETCH_TODOS_QUERY, UPDATE_TODOS_SUBSCRIPTION } from "./queries";
import TodoList from "./components/TodoList";
import Login from "./components/Login";
import Header from "./components/Header";
import { ApolloLink, concat, split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { getMainDefinition } from "apollo-utilities";
import { ApolloProvider } from "react-apollo";

import "./App.css";

function getApolloClient(token) {
  const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext({
      headers: { Authorization: `bearer ${token}` }
    });

    return forward(operation);
  });

  const httpLink = new HttpLink({
    uri: "http://localhost:3000/api/graphql"
  });

  const wsLink = new WebSocketLink({
    uri: "ws://localhost:3000/subscriptions",
    options: {
      reconnect: true
    }
  });

  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    httpLink
  );

  return new ApolloClient({
    link: concat(authMiddleware, link),
    cache: new InMemoryCache()
  });
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem("apollo_fullstack_todolist_user"))
    };
  }

  render() {
    if (!this.state.user) return <Login onSubmit={this.loginOnSubmit.bind(this)} />;
    return (
      <ApolloProvider client={getApolloClient(localStorage.getItem("apollo_fullstack_todolist_token"))}>
        <div id="App">
          <Header user={this.state.user} logout={this.logout.bind(this)} />
          <Query query={FETCH_TODOS_QUERY} variables={{ user_id: this.state.user.id }}>
            {({ data, error, loading, subscribeToMore }) => {
              if (loading) return <div>Loading...</div>;
              if (error) return <div>Error :(</div>;
              return (
                <TodoList
                  todos={data.todos}
                  user={this.state.user}
                  subscribeToTodoUpdates={() => {
                    subscribeToMore({
                      document: UPDATE_TODOS_SUBSCRIPTION,
                      variables: { user_id: this.state.user.id },
                      updateQuery(prev, { subscriptionData }) {
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
      </ApolloProvider>
    );
  }

  async loginOnSubmit(email, password) {
    console.log("loginOnSubmit()");
    const loginResponse = await fetch("http://localhost:3000/api/auth/login", {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password }),
      method: "POST"
    });
    const { token, user } = await loginResponse.json();
    localStorage.setItem("apollo_fullstack_todolist_token", token);
    localStorage.setItem("apollo_fullstack_todolist_user", JSON.stringify(user));
    this.setState({ user });
  }

  logout() {
    localStorage.clear();
    this.setState({ user: null });
  }
}
