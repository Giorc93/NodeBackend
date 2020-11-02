"use strict";

var mongoose = require("mongoose"); //Importing mongoose module
var Schema = mongoose.Schema; //Creating a schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.

var ArticleSchema = Schema({
  //Defining article schema
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
  image: String,
});

module.exports = mongoose.model("Article", ArticleSchema); //Defining model name and schema used
//Mongoose creates and saves documents using this type and structure inside the 'Articles' collection. Note that it takes the model name and adds a 's' at the end to create the collection
