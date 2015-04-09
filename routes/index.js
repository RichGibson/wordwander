var express = require('express');
var router = express.Router();

var wordwander = require('./wordwander.js');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('german.sqlite');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Word Wander' });
});

router.get('/prefix_count', function(req, res, next) {
    rows = wordwander.prefix_count();
    console.log("rows?" + rows);
    query="temp";
    res.render('prefix_count', { title: 'prefix count', rows: rows, top10k: top10k, search_type: 'prefix_count', query: query });
});

router.get('/search', function(req, res, next) {
  search_type = req.query.search_type
  root = req.query.root;
  top10k = req.query.top10k;

  wordwander.save_history(root,search_type);
  query = wordwander.make_query(root,search_type,top10k);

  console.log("query: " + query);

  rslt = db.all(query, function(err,rows){
        console.log("/search in db.all query") ;
        res.render('results', { title: 'search', root: root, rows: rows, top10k: top10k, search_type: search_type, query: query });
        //res.json({ "rows" : rows });
    });
});

router.get('/history', function(req, res, next) {
  console.log('this is history');
  query = "select distinct(wordvalue), query from history order by wordvalue, query";

  history = db.all(query, function(err,rows){
        res.render('history', { title: 'Query History', history: rows });
        //res.json({ "rows" : rows });
    });
});

module.exports = router;
