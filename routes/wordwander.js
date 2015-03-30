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
  get_roots: function(root) {
    var roots = 'foobar';
    console.log("in wordwander.get_roots root: " + root);
    db.all("select word, substr(word,0,instr(word,'ziehen')), instr(word, 'ziehen') from words where word glob '*ziehen' limit 10", function(err,rows){
        
        console.log("in db.all query") ;
        roots = rows;
        return rows;
    });
    
    return rows;
  },
  queue_update: function() {
    /*  walk queue_dir, return an array of projects and the current
        status for each project.
    */
    var projects = {};
    // build the list of projects. An entry is a 'project' if it is a 
    // directory which contains a file :
    // capture_metadata_*.txt
    var files = fs.readdirSync(this.queue.dir); 
    var arrayLength = files.length;
    for (var i = 0; i < arrayLength; i++) {
        var project = this.get_project(files[i]);
        if (project != null) {
            //projects[i] = project;
            projects[files[i]] = project;
        }
    }
    return(projects);
  },

  get_row_col: function(st) {
    // take a directory with the col_nnnn and row_nnnn in the name, 
    // return the col and row.
    pos_c = st.indexOf('col_');
    pos_r = st.indexOf('row_');
    c = parseInt(st.slice(pos_c+4, pos_c+8));
    r = parseInt(st.slice(pos_r+4, pos_r+8));
    return([r,c]);
  },

  get_project: function(f) {
    // take a project path, return the data for this project
    p = this.queue.dir+'/'+f;
    //console.log('get_project f: ' + f);
    //console.log('get_project p: ' + p);
    var project = {} ;
    metadata = this.get_metadata(p);
    if (metadata) {
        data = {};
        data['metadata'] = JSON.parse(metadata);
        project = data;
        project['metadata']['project_file'] = f;
        project['metadata']['project_path'] = p;

        project['stacks'] = this.get_stacks(project);
        project['queue'] = this.queue;
        return project;
    }
    return null;
  },

  get_stacks:function(project) {
    // take a project, return the stacks and their status
    // this assumes the consistent naming structure, there is a project_path
    // which contains directories named 'col_nnnn_row_nnnn' and those directories
    // contain jpg's for each focus position.

    p = project['metadata']['project_path'];

    pattern = p+"/"+"col*";
    project_rows = project['metadata']['project_rows'];
    project_columns = project['metadata']['project_columns'];
    project_stacks = project['metadata']['project_stacks'];

    // initialize the stacks, an array of arrays of objects
    // stack[row][col] = [ positions ]
    // a stack contains:
    // positions = array of jpgs

    var stacks = this.initialize_stacks(project_rows, project_columns);
    
    files_stacks = glob.sync(pattern);
    var arrayLength = files_stacks.length;
    for (var k=0; k < arrayLength; k++) {
        //console.log('get_stacks k:'+k+ ' ' + files_stacks[k]);
        row = this.get_row_col(files_stacks[k])[0];
        col = this.get_row_col(files_stacks[k])[1];

        positions = this.get_positions(files_stacks[k]);
        status = this.get_stack_status(project, files_stacks[k]);
        

        pos = files_stacks[k].lastIndexOf('/');
        stackdir = files_stacks[k].slice(pos+1);


        // so sad, zero based arrays versus 1 based col/rows in the file system
        stacks[row-1][col-1] = {'status':status, 'positions':positions, 'stackdir':stackdir};
        //stacks[row-1][col-1] = {'status':status, 'positions':positions, 'stackdir':stackdir};
        //console.log('get stacks '+ stacks[row-1][col-1].positions[0]);
    }

    //remember :-)
    //c = parseInt();

    return(stacks);
  },

  get_stack_status: function(project, d) {
    // take a stack directory, look for the .lock file, look for the 
    // stacking metadata in: d/stacking_metadata_mm-dd-yyyy_hh-mm-ss.txt
    // and look for d.jpg, the stacked image. Return a status...
    // 
    // This does no locking - so the data is likely to be slightly stale.
    // This data is only used for status display, and as the _initial_
    // tool to let us decide to lock a stack for processing.
    // The actual locking code will try to lock the stack, and only
    // start the focus stacking if the lock is successful.
    var status = '';

    p = project['metadata']['project_path'];

    var pattern_lock      = d+'.lock';
    var pattern_image     = d+'.jpg';
    var pattern_metadata  = d+"stacking_metadata*";

    //console.log("get_stack_status     pattern_lock|"+pattern_lock);
    //console.log("get_stack_status    pattern_image|"+pattern_image);
    //console.log("get_stack_status pattern_metadata|"+pattern_metadata);

    files = glob.sync(pattern_lock);
    var arrayLength = files.length;
    if (arrayLength > 0) {
        status = status + "stacking-locked";
        console.log('get_stack_status return: ' + status);
    
    }

    files = glob.sync(pattern_image);
    var arrayLength = files.length;
    if (arrayLength > 0) {
        status = status + "complete";
        console.log('get_stack_status return: ' + status);
    }

    files = glob.sync(pattern_metadata);
    var arrayLength = files.length;
    if (arrayLength > 0) {
        status = status + "metadata loaded";
        console.log('get_stack_status return: ' + status);
    }


    if (status.length == 0) {
       status = 'not started'; 
    }
    //console.log('get_stack_status return: ' + status);
    return(status);
  },

  get_positions: function (d) {
    // take a directory, return the focus position images in that directory
    positions = [];
    pattern = d + '/*.jpg';
    files = glob.sync(pattern);
    var arrayLength = files.length;
    for (var i=0; i<arrayLength; i++) {
        // this gives us just the file name
        // pos = files[i].lastIndexOf('/');
        // but we want the col_nnnn_row_nnnn also
        pos = files[i].lastIndexOf('col_');
        positions[i] = files[i].slice(pos);  
        //console.log("    get_positions position i:" + i + " "+positions[i]);
    }
    return(positions);
  },

  initialize_stacks: function (r, c) {
    // return an array of arrays, to hold the stacks
    var stacks = [];
    for (i=0; i<r; i++) {
        stacks[i] = [];
        for (j=0; j<c; j++) {
            stacks[i][j] = 'row_' + i + '_col_' + j;
            //stacks[i][j] = 'n/a';
        }
    }
    return stacks;
  },

  get_metadata: function(p) {
    // take a project name, return the metadata.
    // for now the metadata is in a file:
    // capture_metadata_*.txt
    // later it may be in a database.

    var files=[];
    pattern = p+"/"+"capture_metadata_*.txt";
    files = glob.sync(pattern);

    if (files[0]) {
        data = fs.readFileSync(files[0], 'utf8');
        //if (err) {
        //    console.log('no metadata');
        //    return {};
        //}
        return(data);
    }
  }
};


