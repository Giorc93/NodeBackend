"use strict";

//Importing modules

var validator = require("validator"); //Creating validator var to validate data recieved from HTTP req
var Article = require("../models/articleModel"); //Using mongoose "Article" model created to create and modify objects
var fs = require("fs"); //Enables interacting with the file system in a way modeled on standard POSIX functions.
var path = require("path"); //The path module provides utilities for working with file and directory paths.

var controller = {
  save: (req, res) => {
    //Getting POST data
    var params = req.body;

    //Validate data (Validator)
    try {
      var validateTitle = !validator.isEmpty(params.title); //Returns true or false
      var validateContent = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(400).send({
        message: "Data is missing",
      });
    }

    if (validateTitle && validateContent) {
      //Create object to be saved
      var article = new Article(); //Creating new article object using model

      //Assing values

      if (params.image) {
        article.image = params.image;
      } else {
        article.image = null;
      }
      article.title = params.title;
      article.content = params.content;

      //Save the article
      article.save((err, articleStored) => {
        if (err || !articleStored) {
          return res.status(400).send({
            message: "Data couldn't be saved",
          });
        }

        //Return response
        return res.status(200).send({
          articleStored,
        });
      });
    } else {
      return res.status(400).send({
        message: "Data is missing",
      });
    }
  },

  getArticles: (req, res) => {
    var query = Article.find({}); //Creating query using .find method

    var last = req.params.last;

    if (last || last != undefined) {
      query.limit(5);
    }

    //Find
    query.sort("-_id").exec((err, articles) => {
      //Sorting results and executing query
      if (err) {
        return res.status(400).send({
          message: "Error loading articles. Try again",
        });
      } else if (!articles) {
        return res.status(400).send({
          message: "No articles to show",
        });
      }

      return res.status(200).send({
        articles,
      });
    });
  },

  getArticle: (req, res) => {
    //Get id from URL
    var articleId = req.params.id;

    //Check if the id exists

    if (!articleId || articleId == null) {
      return res.status(404).send({
        message: "Article does not exists. Try again",
      });
    }
    //Find the article

    Article.findById(articleId, (err, article) => {
      if (err || !article) {
        return res.status(500).send({
          message: "Server error",
        });
      }
      //Return JSON

      return res.status(200).send({
        message: "Success",
        article,
      });
    });
  },

  update: (req, res) => {
    //Get id from URL
    var articleId = req.params.id;

    //Get data from PUT
    var params = req.body;

    //Validate data
    try {
      var validateTitle = !validator.isEmpty(params.title);
      var validateContent = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(404).send({
        message: "Data is missing",
      });
    }
    if (validateTitle && validateContent) {
      //Find and update
      Article.findOneAndUpdate(
        { _id: articleId },
        params,
        { new: true },
        (err, articleUpdated) => {
          if (err) {
            return res.status(500).send({
              message: "Cannot update",
            });
          } else if (!articleUpdated) {
            return res.status(404).send({
              message: "Article does not exists",
            });
          }
          //Return
          return res.status(200).send({
            message: "Success",
            articleUpdated,
          });
        }
      );
    } else {
      return res.status(404).send({
        message: "Invalid data. Try again",
      });
    }
  },

  delete: (req, res) => {
    //Get id from URL
    var articleId = req.params.id;

    //Find by id and delete
    Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
      if (err) {
        return res.status(500).send({
          message: "Server error",
        });
      } else if (!articleRemoved) {
        return res.status(404).send({
          message: "Article was not removed. Verify ID and try again",
        });
      }

      return res.status(200).send({
        message: "Success",
        articleRemoved,
      });
    });
  },

  upload: (req, res) => {
    //Configure Connect Multiparty module router/article.js (Create middleware and pass it as an argument to the route parameters)

    //Get file from request
    var fileName = "Img not loaded";

    if (!req.files) {
      return res.status(404).send({
        message: fileName,
      });
    }

    //Get file name and extension
    var filePath = req.files.file0.path;
    var fileSplit = filePath.split("\\");

    //***Warning*** LINUX or MAC
    //var fileSplit = filePath.split('/');

    //Getting file name
    var fileName = fileSplit[2];

    //Getting file extension
    var nameSplit = fileName.split(".");
    var fileExt = nameSplit[1];

    //Validate extension, image files only

    if (
      fileExt != "png" &&
      fileExt != "jpg" &&
      fileExt != "jpeg" &&
      fileExt != "gif"
    ) {
      //Delete uploaded file
      fs.unlink(filePath, (err) => {
        return res.status(400).send({
          message: "File extension is invalid",
        });
      });
    } else {
      //Check validations, getting article id from URL
      var articleId = req.params.id;

      if (articleId) {
        //Find article, assign image name and update it
        Article.findOneAndUpdate(
          { _id: articleId },
          { image: fileName },
          { new: true },
          (err, articleUpdated) => {
            if (err || !articleUpdated) {
              return res.status(400).send({
                message: "Image couldn't be loaded",
              });
            }
            return res.status(200).send({
              message: "Image uploaded",
              articleUpdated,
            });
          }
        );
      } else {
        return res.status(200).send({
          message: "Image uploaded",
          image: fileName,
        });
      }
    }
  },

  getImage: (req, res) => {
    var file = req.params.image;
    var absPath = path.join(__dirname, "..", "upload", "articles", file);

    var exists = fs.existsSync(absPath);

    if (exists) {
      return res.sendFile(absPath, (err) => {
        if (err) {
          next(err);
        } else {
          console.log("Sent image");
        }
      });
    } else {
      return res.status(500).send({ message: "Doesn't exists" });
    }
  },

  search: (req, res) => {
    //Get string
    var searchString = req.params.search;
    //Find or
    Article.find({
      $or: [
        { title: { $regex: searchString, $options: "i" } },
        { content: { $regex: searchString, $options: "i" } },
      ],
    })
      .sort([["date", "descending"]])
      .exec((err, articles) => {
        if (err) {
          return res.status(500).send({
            message: "Server error",
          });
        } else if (!articles || articles.length <= 0) {
          return res.status(404).send({
            message: "No articles to show",
          });
        }

        return res.status(200).send({
          message: "succes",
          articles,
        });
      });
  },
}; //End controller

//Exporting

module.exports = controller;
