"use strict";

var mongoose = require("mongoose");
var app = require("./app"); //Loading created module 'app'
var port = 3900;

//Setting connection to MongoDB
mongoose.set("useFindAndModify", false);
mongoose
  .connect("mongodb://localhost:27017/api_rest_blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successful Connection...");

    //Creating Server, Listening HTTP requests

    app.listen(port, () => {
      console.log("Server running on http://localhost:" + port);
    });
  });
