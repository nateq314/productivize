import React, { Component } from "react";
import "./App.css";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const FETCH_TODOS_QUERY = gql`
  query {
    todos(user_id: 12) {
      content
      important
    }
  }
`;

const App = () => (
  <Query query={FETCH_TODOS_QUERY}>
    {({ data, error, loading }) => {
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error :(</div>;
      return <ul>{data.todos.map((todo, idx) => <li key={idx}>{todo.content}</li>)}</ul>;
    }}
  </Query>
);

export default App;
