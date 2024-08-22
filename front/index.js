var express = require("express");
var app = express();
var path = require("path");

app.use(express.static(path.join(__dirname, "dist")));

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

app.listen(2021, () => {
  console.log("CCG server running");
});
