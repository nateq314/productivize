import React from "react";
import Login from "./components/Login/Login";
import AppHeader from "./components/AppHeader/AppHeader";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./routes/Home/Home";
import Profile from "./routes/Profile/Profile";
import Register from "./routes/Register/Register";
import { ApolloProvider, Query } from "react-apollo";
import { getApolloClient } from "./apollo";
import { FETCH_USER_QUERY, UPDATE_USER_SUBSCRIPTION } from "./queries";
import { host, port } from "./apollo";

import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.client = getApolloClient(localStorage.getItem("apollo_fullstack_todolist_token"));
    this.state = {
      user_id: localStorage.getItem("apollo_fullstack_todolist_user_id")
    };
  }

  render() {
    if (!this.state.user_id)
      return (
        // NON-AUTHENTICATED ROUTES
        <Router>
          <div>
            <Route exact={true} path="/" render={() => <Login onSubmit={this.loginOnSubmit.bind(this)} />} />
            <Route
              path="/register"
              render={routerProps => <Register onRegister={this.registerOnSubmit.bind(this, routerProps.history)} />}
            />
          </div>
        </Router>
      );
    return (
      // AUTHENTICATED ROUTES
      <ApolloProvider client={this.client}>
        <Query query={FETCH_USER_QUERY} variables={{ id: this.state.user_id }}>
          {({ data, loading, error, subscribeToMore }) => {
            if (loading) return null;
            const { user } = data;
            subscribeToMore({
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
                <div id="App">
                  <Route path="/" render={() => <AppHeader logout={this.logout.bind(this)} user={user} />} />
                  <Route exact={true} path="/" render={() => <Home user={user} />} />
                  <Route path="/profile" render={() => <Profile user={user} />} />
                </div>
              </Router>
            );
          }}
        </Query>
      </ApolloProvider>
    );
  }

  async loginOnSubmit(email, password) {
    console.log("loginOnSubmit()");
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

  async registerOnSubmit(history, first_name, last_name, email, password) {
    console.log("registerOnSubmit()");
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
      history.push("/");
    }
  }

  logout() {
    localStorage.clear();
    this.setState({ user_id: null });
  }
}
