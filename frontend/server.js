// Imports
const express = require("express");
const path = require("path");
const https = require("https");
const fs = require("fs");

// Other variables
const app = express();
const port = 443;
const baseDir = "build";

const https_options = {
  key: fs.readFileSync("certs/privkey.pem"),
  cert: fs.readFileSync("certs/fullchain.pem")
  // ca: [
  //   fs.readFileSync("certs/COMODORSADomainValidationSecureServerCA.crt"),
  //   fs.readFileSync("certs/COMODORSAAddTrustCA.crt")
  // ],
  // passphrase: process.env.SSL_CERT_PW
};

app.use(express.static(baseDir));

// Client routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./", baseDir, "/index.html"));
});

https.createServer(https_options, app).listen(port);
