import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import { ApolloClient } from "apollo-client";
import { ApolloLink, concat } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      Authorization:
        "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoibl9xdWFybGVzQGhvdG1haWwuY29tIiwiZmlyc3RfbmFtZSI6Ik5hdGhhbiIsImxhc3RfbmFtZSI6IlF1YXJsZXMiLCJjcmVhdGVkX2F0IjpudWxsLCJ1cGRhdGVkX2F0IjpudWxsLCJpYXQiOjE1MjE3Njc4NjN9.PODtfhozXpNYkKEeZOaqiLirGLuP12Jt-ezCLLqknv0"
    }
  });

  return forward(operation);
});

const client = new ApolloClient({
  link: concat(
    authMiddleware,
    new HttpLink({
      uri: "http://localhost:3000/api/graphql"
    })
  ),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
registerServiceWorker();
