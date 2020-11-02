"use strict";

//Loading node modules

var express = require("express");
var bodyParser = require("body-parser");

//Executing express
var app = express();

//Loading routes files
var articleRoutes = require("./routes/articleRoute");

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

//Loading routes
app.use("/api", articleRoutes);

//Test route
/*
app.get("/test", (req, res) => {
  return res.status(200).send({
    course: "Frameworks",
    name: "Gio",
    url: "giorc93@hotmail.com",
  });
});
*/

//Exporting module

module.exports = app;
