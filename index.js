//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// Get method
app.route("/articles").get(function(req, res){
    Article.find(function(err, articles){
        if (!err) {
            if (articles) {
                // const jsonArticles = JSON.stringify(articles);
                // res.send(jsonArticles);
                res.send(articles);
            } else {
                res.send("No articles currently in wikiDB.");
            }
        } else {
            res.send(err)
        }
        
    });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});