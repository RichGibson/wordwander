var express = require('express');
var router = express.Router();

var wordwander = require('./wordwander.js');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('german.sqlite');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Word Wander' });
});

/* GET prefixes*/
/* router.get('/prefixes/:root', function(req, res, next) { */

router.get('/prefixes', function(req, res, next) {
  root = req.query.root;
  query = "insert into history values ('" + root + "', 'prefixes')";
  prefixes = db.all(query, function(err,rows){ });
  //root = req.params.root;
  console.log("in index.js prefixes root:" + root);
  // prefixes = wordwander.get_roots(root);
  query = "select word, substr(word,0,instr(word,'" + root + "')) as prefix, top as top10k from words where word glob '*" + root + "'";

  prefixes = "foo";
  prefixes = db.all(query, function(err,rows){
        console.log("/prefixes in db.all query") ;
        //console.log(rows); 
        res.render('prefixes', { title: 'Prefixes', root: root, prefixes: rows });
        //res.json({ "rows" : rows });
    });
});

router.get('/contains', function(req, res, next) {
  root = req.query.prefix;
  query = "insert into history values ('" + root + "', 'contains')";
  prefixes = db.all(query, function(err,rows){ });
  console.log("in index.js contains root:" + root);
  // prefixes = wordwander.get_roots(root);
  query = "select word, substr(word,0,instr(word,'" + root + "')) as prefix, top as top10k from words where word glob '*" + root + "*'";

  prefixes = "foo";
  prefixes = db.all(query, function(err,rows){
        console.log("in db.all query") ;
        //console.log(rows); 
        res.render('contains', { title: 'Contains', root: root, rows: rows });
        //res.json({ "rows" : rows });
    });
});

router.get('/starts', function(req, res, next) {
  console.log('this is starts');
  root = req.query.prefix;
  query = "insert into history values ('" + root + "', 'starts')";
  prefixes = db.all(query, function(err,rows){ });
  console.log("in index.js /starts root:" + root);
  l = root.length + 1;
  query = "select word, substr(word," + l + ") as prefix, top as top10k from words where word glob '" + root + "*'";

  prefixes = "foo";
  prefixes = db.all(query, function(err,rows){
        console.log("/starts in db.all query") ;
        //console.log(rows); 
        res.render('starts', { title: 'Words that start with...', root: root, prefixes: rows });
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

/* GET all projects json. */
router.get('/projects.json', function(req, res, next) {
  projects = wordwander.queue_update('');
  res.send(projects);
});

/* GET all projects home page. */
// I'd like to pass a queue_dir, but I don't know how :-/
router.get('/projects(/:queue_dir)?', function(req, res, next) {
  if (req.params.queue_dir) {
    wordwander.queue.dir = req.params.queue_dir;
  }
  projects = wordwander.queue_update('')
  res.render('projects', { title: 'Word Explorer', projects: projects });
});

module.exports = router;
