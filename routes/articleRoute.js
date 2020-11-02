"use strict";

var express = require("express"); //Allows routing and other HTTP handling methods
var articleController = require("../controllers/articleController"); //Importing article controller

var router = express.Router(); //Loading router

var multipart = require("connect-multiparty"); //Loading connect multiparty module
var md_upload = multipart({ uploadDir: "./upload/articles" }); //Creating middleware (Must create specified dir/path)

//Article routes
router.post("/save", articleController.save);
router.get("/articles/:last?", articleController.getArticles);
router.get("/article/:id", articleController.getArticle);
router.put("/article/:id", articleController.update);
router.delete("/article/:id", articleController.delete);
router.post("/uploadImage/:id?", md_upload, articleController.upload); //Loading middleware
router.get("/getImage/:image", articleController.getImage);
router.get("/search/:search", articleController.search);

module.exports = router;
