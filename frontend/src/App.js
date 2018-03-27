import React from "react";
import { Query } from "react-apollo";
import { FETCH_TODOS_QUERY } from "./queries";
import TodoList from "./components/TodoList";
import TodoInput from "./components/TodoInput";

import "./App.css";

const App = () => (
  <div id="App">
    <TodoInput />
    <Query query={FETCH_TODOS_QUERY}>
      {({ data, error, loading }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error :(</div>;
        return <TodoList todos={data.todos} />;
      }}
    </Query>
  </div>
);

export default App;
