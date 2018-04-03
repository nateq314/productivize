import express from "express";
import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import schema from "./schema";
import AuthController from "./auth/AuthController";
import passport from "passport";
import cors from "cors";
import { execute, subscribe } from "graphql";
import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";

require("./passport");

const PORT = 3000;

const app = express();

app.use(cors());
app.use(
  "/api/graphql",
  bodyParser.json(),
  passport.authenticate("jwt", { session: false }),
  graphqlExpress({ schema })
);
app.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/api/graphql",
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
    passHeader:
      "'Authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoibl9xdWFybGVzQGhvdG1haWwuY29tIiwiZmlyc3RfbmFtZSI6Ik5hdGhhbiIsImxhc3RfbmFtZSI6IlF1YXJsZXMiLCJjcmVhdGVkX2F0IjpudWxsLCJ1cGRhdGVkX2F0IjpudWxsLCJpYXQiOjE1MjE3Njc4NjN9.PODtfhozXpNYkKEeZOaqiLirGLuP12Jt-ezCLLqknv0'"
  })
);
app.use("/api/auth", bodyParser.json(), AuthController);

const ws = createServer(app);
ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);

  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema
    },
    {
      server: ws,
      path: "/subscriptions"
    }
  );
});
