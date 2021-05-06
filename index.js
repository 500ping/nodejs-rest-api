//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
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

app.route("/articles")

// Get All Articles
.get((req, res) => {
    Article.find((err, articles) => {
        if (!err) {
            if (articles) {
                res.send(articles);
            } else {
                res.send({
                    "message": "No articles currently in wikiDB."
                });
            }
        } else {
            res.send(err);
        }
        
    });
})

// Create An Article
.post((req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err) => {
        if (!err) {
            res.send(newArticle);
        } else {
            res.send(err);
        }
    });
})

// Delete All Articles
.delete((req, res) => {
    Article.deleteMany((err) => {
        if (!err) {
            res.send({
                "message": "All articles deleted!!!"
            });
        } else {
            res.send(err);
        }
    })
});

app.route("/articles/:title")

// Get An Article By Title
.get((req, res) => {
    Article.findOne(
        {
            title: req.params.title
        }, (err, foundArticle) => {
        if (!err) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send({
                    "message": "No Record Found!!!"
                });
            }
        } else {
            res.send(err);
        }
    });
})

// Update An Article By Title (All Fields)
.put((req, res) => {
    Article.update(
        {
            title: req.params.title
        }, 
        {
            title: req.body.title,
            content: req.body.content
        },
        {
            overwrite: true
        }, (err, updatedArticle) => {
            if (!err) {
                res.send({
                    "message": "Update Success!!!"
                });
            } else {
                res.send(err);
            }
        }
    );
})

// Update An Article By Title (Specific Fields)
.patch((req, res) => {
    Article.update(
        {
            title: req.params.title
        }, 
        {
            $set: req.body
        }, (err, updatedArticle) => {
            if (!err) {
                res.send({
                    "message": "Update Success!!!"
                });
            } else {
                res.send(err);
            }
        }
    );
})

// Delete An Article
.delete((req, res) => {
    Article.deleteOne(
        {
            "title": req.params.title
        }, (err) => {
            if (!err) {
                res.send({
                    "message": "Delete Success!!!"
                });
            } else {
                res.send(err);
            }
        }
    );
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});