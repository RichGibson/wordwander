// wordwander.js - functions in support of wordwander , by Rich Gibson
// to test, from the project directory:
// make test

var glob = require('glob');
var fs = require('fs');
var files   = [];
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('german.sqlite');


module.exports = {
  queue:  {
      dir : '',
      url : ''
  } ,
  save_history: function(root, search_type) {
      console.log("save_history root: " + root + " search_type:"+search_type);
      query = "insert into history values ('" + root + "','"+search_type +"')";
      console.log("save_history query: " + query);
      history = db.all(query, function(err,rows){ });
  },
  prefix_count: function(top10k) {
    //look at the prefixes...
    query  = "select prefix from prefixes order by prefix";
    rslt = db.each(query, function(err,row) {
        console.log("in db rslt loop?");
        console.log(row);
        console.log(row.prefix);
        cnt_query = "select count(*) as cnt from words where word like '" + row.prefix + "%'";
        console.log(cnt_query);
        rslt = []; 
        rslt2 = db.each(cnt_query, function(err,cntrow) {
            console.log(row.prefix + " : " + cntrow.cnt);
            rslt[row.prefix] = cntrow.cnt;
        });
        console.log("rslt: "+ rslt);
        
    });
  },
  make_query: function(root,search_type,top10k) {
    
    if (typeof top10k == 'undefined') {
        top10k = 0;
    } 

    top10k_clause = '';
    if (top10k > 0) {
        //console.log("in index.js top10k query");
        top10k_clause = " and top>0";
    }

    glob_clause = '';
    if (search_type == "prefix") {
        // glob - prefix
        glob_clause = " word glob '*" + root + "'";
    }

    if (search_type == "suffix") {
        // glob - starts
        glob_clause = " word glob '" + root + "*'";
    }

    if (search_type == "contains") {
        //glob - contains
        glob_clause = " word glob '*" + root + "*'" ;
    }
    query = "select word, substr(word,0, instr(word,'" + root + "')) as prefix," +
        "substr(word," + root.length + "+ instr(word, '" + root + "' ) ) as suffix,  " +
        "instr(word, '" + root + "') as root_pos, " +
        "length(substr(word,0, instr(word,'" + root + "'))) as l, " + 
        "top " +
        "from words where " + glob_clause + top10k_clause;
    return query;
  }
};


