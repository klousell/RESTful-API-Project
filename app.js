const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/WikiDB');

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

//Requests for All Articles

app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, docs) {
      if (!err) {
        res.send(docs);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });
    article.save(function(err){
      if (!err){
        res.send("success")
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if(!err) {
        res.send("deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

//Requests for a Specific Article

app.route("/articles/:articleTitle")
  .get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, docs) {
      if(docs) {
        res.send(docs)
      } else {
        res.send("No articles found");
      }
    });
  });

app.listen(3000, function() {
  console.log('Listening on port 3000');
});
