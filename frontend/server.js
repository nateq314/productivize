// Imports
const express = require("express");
const path = require("path");

// Other variables
const app = express();
const port = 80;
const baseDir = "build";

app.use(express.static(baseDir));

// Client routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./", baseDir, "/index.html"));
});

app.listen(port, () => {
  console.log("Now serving on port " + port);
});
