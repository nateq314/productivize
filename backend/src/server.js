import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import schema from "./schema";
import AuthController from "./auth/AuthController";
import passport from "passport";
import cors from "cors";
import { execute, subscribe } from "graphql";
import http from "http";
import https from "https";
import { SubscriptionServer } from "subscriptions-transport-ws";
import path from "path";
import process from "process";

require("./passport");

const isProd = process.env.NODE_ENV === "production";
const PORT = 3000;

const app = express();

function getFullPath(filename) {
  return path.join(__dirname, "../", "certs", filename);
}

const https_options = {
  key: fs.readFileSync(getFullPath("productivize.key")),
  cert: fs.readFileSync(getFullPath("productivize_net.crt")),
  ca: [
    fs.readFileSync(getFullPath("COMODORSADomainValidationSecureServerCA.crt")),
    fs.readFileSync(getFullPath("COMODORSAAddTrustCA.crt"))
  ],
  passphrase: process.env.SSL_CERT_PW
};

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
      "'Authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoibl9xdWFybGVzQGhvdG1haWwuY29tIiwiZmlyc3RfbmFtZSI6Ik5hdGhhbiIsImxhc3RfbmFtZSI6IlF1YXJsZXMiLCJjcmVhdGVkX2F0IjoiMjAxOC0wMy0yM1QxNTowMToyNy43ODlaIiwidXBkYXRlZF9hdCI6IjIwMTgtMDQtMDNUMDE6NDQ6MDYuMjc5WiIsImlhdCI6MTUyMjcxOTkyMH0.mBDLS8UIJ52CmdQEtWF9toxpu-CCxjx_kWXmWdG5p90'"
  })
);
app.use("/api/auth", bodyParser.json(), AuthController);

const ws = isProd ? https.createServer(https_options, app) : http.createServer(app);
ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on port ${PORT}`);

  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
      onConnect(connectionParams, websocket) {
        console.log("====================== CONNECTED ====================");
        // console.log("websocket:", websocket);
        // console.log("=====================================================");
      },
      onDisconnect(websocket, context) {
        console.log("==================== DISCONNECTED ====================");
        // console.log("websocket:", websocket);
        // console.log("======================================================");
      },
      onOperationComplete(websocket, opId) {
        console.log("==================== OPERATION DONE ====================");
        // console.log("opId:", opId);
        // console.log("========================================================");
      }
    },
    {
      server: ws,
      path: "/subscriptions"
    }
  );
});
