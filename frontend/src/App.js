import React from "react";
import Login from "./components/Login/Login";
import AppHeader from "./components/AppHeader/AppHeader";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./routes/Home/Home";
import Profile from "./routes/Profile/Profile";
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
    if (!this.state.user_id) return <Login onSubmit={this.loginOnSubmit.bind(this)} />;
    return (
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
    localStorage.setItem("apollo_fullstack_todolist_token", token);
    localStorage.setItem("apollo_fullstack_todolist_user_id", JSON.stringify(id));
    this.client = getApolloClient(token);
    this.setState({ user_id: id });
  }

  logout() {
    localStorage.clear();
    this.setState({ user_id: null });
  }
}
