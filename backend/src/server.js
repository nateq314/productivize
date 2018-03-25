import express from "express";
import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import schema from "./schema";
import AuthController from "./auth/AuthController";
import passport from "passport";
import cors from "cors";

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
app.use("/api/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));
app.use("/api/auth", bodyParser.json(), AuthController);

app.listen(PORT);
