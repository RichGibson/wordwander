var express = require('express');
var router = express.Router();

var wordexplorer = require('./wordexplorer.js');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('german.sqlite');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Word Explorer' });
});

/* GET prefixes*/
/* router.get('/prefixes/:root', function(req, res, next) { */

router.get('/prefixes', function(req, res, next) {
  root = req.query.root;
  //root = req.params.root;
  console.log("in index.js prefixes root:" + root);
  // prefixes = wordexplorer.get_roots(root);
  query = "select word, substr(word,0,instr(word,'" + root + "')) as prefix from words where word glob '*" + root + "'";

  prefixes = "foo";
  prefixes = db.all(query, function(err,rows){
        console.log("in db.all query") ;
        //console.log(rows); 
        res.render('prefixes', { title: 'Prefixes', root: root, prefixes: rows });
        //res.json({ "rows" : rows });
    });
});

/* GET all projects json. */
router.get('/projects.json', function(req, res, next) {
  projects = wordexplorer.queue_update('');
  res.send(projects);
});

/* GET all projects home page. */
// I'd like to pass a queue_dir, but I don't know how :-/
router.get('/projects(/:queue_dir)?', function(req, res, next) {
  if (req.params.queue_dir) {
    wordexplorer.queue.dir = req.params.queue_dir;
  }
  projects = wordexplorer.queue_update('')
  res.render('projects', { title: 'Word Explorer', projects: projects });
});

module.exports = router;
