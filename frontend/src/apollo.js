import { ApolloLink, concat, split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { getMainDefinition } from "apollo-utilities";

const isProd = process.env.NODE_ENV === "production";
export const host = isProd ? "35.231.237.155" : "localhost";
export const port = "3000";

export function getApolloClient(token) {
  if (token) {
    const authMiddleware = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      operation.setContext({
        headers: { Authorization: `bearer ${token}` }
      });

      return forward(operation);
    });

    const httpLink = new HttpLink({
      uri: `http://${host}:${port}/api/graphql`
    });

    const wsLink = new WebSocketLink({
      uri: `ws://${host}:3000/subscriptions`,
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
  return null;
}
