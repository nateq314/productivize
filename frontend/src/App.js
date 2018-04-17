// @flow

import React from "react";
import Login from "./components/Login/Login";
import AppHeader from "./components/AppHeader/AppHeader";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Home from "./routes/Home/Home";
import Profile from "./routes/Profile/Profile";
import Register from "./routes/Register/Register";
import { ApolloProvider, Query } from "react-apollo";
import { getApolloClient } from "./apollo";
import { FETCH_USER_QUERY, UPDATE_USER_SUBSCRIPTION } from "./queries";
import { host, port } from "./apollo";
import { log } from "./debug";

import "./App.css";

export type User = {
  id: number,
  first_name: string,
  last_name: string,
  email: string
};

export type ContextMenuObjType = ?{
  todoID: number,
  x: number,
  y: number
};

type AppState = {
  user_id: ?string,
  contextMenu: ?ContextMenuObjType
};

export default class App extends React.Component<{}, AppState> {
  client: any;
  userUpdateUnsubscribe: () => void;

  constructor(props: any) {
    super(props);
    this.client = getApolloClient(localStorage.getItem("apollo_fullstack_todolist_token"));
    this.state = {
      user_id: localStorage.getItem("apollo_fullstack_todolist_user_id"),
      contextMenu: null
    };
  }

  componentWillUnmount() {
    log("componentWillUnmount()");
    if (this.userUpdateUnsubscribe) {
      this.userUpdateUnsubscribe();
    }
  }

  render() {
    if (!this.state.user_id)
      return (
        // NON-AUTHENTICATED ROUTES
        <Router>
          <Switch>
            <Route exact={true} path="/" render={() => <Login onSubmit={this.loginOnSubmit.bind(this)} />} />
            <Route path="/register" render={() => <Register onRegister={this.registerOnSubmit.bind(this)} />} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </Router>
      );
    return (
      // AUTHENTICATED ROUTES
      <ApolloProvider client={this.client}>
        <Query query={FETCH_USER_QUERY} variables={{ id: this.state.user_id }}>
          {({ data, loading, error, subscribeToMore }) => {
            if (loading) return null;
            const { user } = data;
            this.userUpdateUnsubscribe = subscribeToMore({
              document: UPDATE_USER_SUBSCRIPTION,
              variables: { id: user.id },
              updateQuery(prev, { subscriptionData }) {
                if (!subscriptionData.data) return prev;
                return {
                  ...prev,
                  user: subscriptionData.data.userUpdate
                };
              }
            });
            return (
              <Router>
                <div id="App" onClick={this.appOnClick.bind(this)} onContextMenu={this.appOnClick.bind(this)}>
                  <AppHeader logout={this.logout.bind(this)} user={user} />
                  <Switch>
                    <Route
                      exact={true}
                      path="/"
                      render={() => (
                        <Home
                          user={user}
                          contextMenu={this.state.contextMenu}
                          clearContextMenu={this.clearContextMenu}
                          setContextMenu={this.setContextMenu.bind(this)}
                        />
                      )}
                    />
                    <Route path="/profile" render={() => <Profile user={user} />} />
                    <Route render={() => <Redirect to="/" />} />
                  </Switch>
                </div>
              </Router>
            );
          }}
        </Query>
      </ApolloProvider>
    );
  }

  async loginOnSubmit(email: string, password: string) {
    log("loginOnSubmit()");
    const loginResponse = await fetch(`http://${host}:${port}/api/auth/login`, {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password }),
      method: "POST"
    });
    const { token, id } = await loginResponse.json();
    if (token && id) {
      localStorage.setItem("apollo_fullstack_todolist_token", token);
      localStorage.setItem("apollo_fullstack_todolist_user_id", JSON.stringify(id));
      this.client = getApolloClient(token);
      this.setState({ user_id: id });
    }
  }

  async registerOnSubmit(first_name: string, last_name: string, email: string, password: string) {
    log("registerOnSubmit()");
    const response = await fetch(`http://${host}:${port}/api/auth/register`, {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ first_name, last_name, email, password }),
      method: "POST"
    });
    const { id, token } = await response.json();
    if (token && id) {
      localStorage.setItem("apollo_fullstack_todolist_token", token);
      localStorage.setItem("apollo_fullstack_todolist_user_id", JSON.stringify(id));
      this.client = getApolloClient(token);
      this.setState({ user_id: id });
    }
  }

  logout() {
    localStorage.clear();
    this.setState({ user_id: null });
    this.userUpdateUnsubscribe();
  }

  appOnClick(e: SyntheticMouseEvent<HTMLDivElement>) {
    // log("appOnClick()");
    if (this.state.contextMenu) {
      this.setState({
        contextMenu: null
      });
    }
  }

  clearContextMenu = () => {
    this.setState({
      contextMenu: null
    });
  };

  setContextMenu(e: SyntheticMouseEvent<HTMLLIElement>, todoID: number) {
    e.preventDefault();
    const screenWidth: number = (document.getElementById("App"): any).clientWidth;
    this.setState({
      contextMenu: {
        todoID: todoID,
        x: e.clientX < screenWidth - 145 ? e.clientX + 5 : e.clientX - 145,
        y: e.clientY - 160
      }
    });
  }
}
