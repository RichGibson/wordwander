var should = require('chai').should(),
    scapegoat = require('../routes/workflow.js'),
    queue_update = scapegoat.queue_update,
    get_project = scapegoat.get_project,
    get_stacks = scapegoat.get_stacks,
    get_stack_status = scapegoat.get_stack_status,
    get_positions = scapegoat.get_positions,
    get_metadata = scapegoat.get_metadata,
    get_row_col = scapegoat.get_row_col;


describe('#get_row_col', function() {
  it('returns row and col of a stack from a directory name', function() {
    st= '/gigamacro_images/mica_5x_polarized_01-26-2015_14-01-15/col_0004_row_0002/';
    n = get_row_col(st)
    n[0].should.equal(2);
    n[1].should.equal(4);
  });

  it('returns row and col', function() {
    st= '/gigamacro_images/mica_5x_polarized_01-26-2015_14-01-15/col_0024_row_0037/';
    n = get_row_col(st)
    n[0].should.equal(37);
    n[1].should.equal(24);
  });
});

describe('#get_metadata', function() {
  it('Return a json object with the metadata for a project', function() {
    data = get_metadata('');
    // todo: testing for metadata is covered elsewhere?
  });

});

describe('#queue_update', function() {
  it('Get the full project queue, , test it', function() {
    scapegoat.queue.dir = '/Users/richgibson/wa/gigamacro/workflow/test/gigamacro_images';
    scapegoat.queue.url = '/test/gigamacro_images';

    var projects = scapegoat.queue_update(scapegoat.queue.dir); 
    console.log("queue_update test, projects are..." + projects);
    Object.keys(projects).length.should.equal(3);

  });
});


describe('#get_project', function() {
  it('Get the project, test it', function() {
    scapegoat.queue.dir = '/Users/richgibson/wa/gigamacro/workflow/test/gigamacro_images';
    scapegoat.queue.url = '/test/gigamacro_images';
    
    project = scapegoat.get_project('sample_three');
    project.metadata.project_file.should.equal('sample_three');
    project.metadata.project_columns.should.equal('3');
    project.metadata.project_rows.should.equal('3');

  });

  it('Test stacks', function() {
    scapegoat.queue.dir = '/Users/richgibson/wa/gigamacro/workflow/test/gigamacro_images';
    scapegoat.queue.url = '/test/gigamacro_images';
    project = scapegoat.get_project('sample_three');
    project.metadata.project_file.should.equal('sample_three');
    project.stacks[0][0].positions[0].should.equal('col_0001_row_0001/photo_focusposition_0.000.jpg');
    //project.stacks[0][0][0].should.equal('col_0001_row_0001/photo_focusposition_0.000.jpg');
    //n = get_row_col(st)
    //n[0].should.equal(24);
  });
});

describe('#get_stack_status', function() {
  it('What is the status of a stack?', function() {
    scapegoat.queue.dir = '/Users/richgibson/wa/gigamacro/workflow/test/gigamacro_images';
    scapegoat.queue.url = '/test/gigamacro_images';
    
    project = scapegoat.get_project('sample_three');
    console.log("in test project: "+project);
    console.log("in test project.stacks[0][0]: "+project.stacks[0][0].keys);
    // how should multiple statuses be displayed?
    project.stacks[0][0].status.should.equal('complete');
    project.stacks[0][1].status.should.equal('stacking'); // col 1 row 2
    project.stacks[0][2].status.should.equal('metadata loaded'); // col 1 row 3

  });
});


//var queue_dir = '/Users/richgibson/wa/gigamacro/workflow/public/images/gigamacro_images';
