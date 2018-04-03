import React from "react";
import Login from "./components/Login/Login";
import AppHeader from "./components/AppHeader/AppHeader";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./routes/Home/Home";
import Profile from "./routes/Profile/Profile";
import { ApolloProvider, Subscription } from "react-apollo";
import { getApolloClient } from "./apollo";
import { UPDATE_USER_SUBSCRIPTION } from "./queries";

import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.client = getApolloClient(localStorage.getItem("apollo_fullstack_todolist_token"));
    this.state = {
      user: JSON.parse(localStorage.getItem("apollo_fullstack_todolist_user"))
    };
  }

  render() {
    if (!this.state.user) return <Login onSubmit={this.loginOnSubmit.bind(this)} />;
    return (
      <ApolloProvider client={this.client}>
        <Subscription subscription={UPDATE_USER_SUBSCRIPTION} variables={{ id: this.state.user.id }}>
          {({ data, loading, error }) => (
            <Router>
              <div id="App">
                <Route path="/" render={() => <AppHeader logout={this.logout.bind(this)} user={this.state.user} />} />
                <Route exact={true} path="/" render={() => <Home user={this.state.user} />} />
                <Route path="/profile" render={() => <Profile user={this.state.user} />} />
              </div>
            </Router>
          )}
        </Subscription>
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
    this.client = getApolloClient(token);
    this.setState({ user });
  }

  logout() {
    localStorage.clear();
    this.setState({ user: null });
  }
}
