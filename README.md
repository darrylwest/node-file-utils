# Node File Utils
- - -

A simple set of file utility and mock classes.  Modules are a stand-alone class-like objects constructed with injected variable options.  The intent is to provide small specific helpers to solve typical linux/unix file system problems.

_Requires node streams2, i.e., 0.10.x_

## Installation

    npm install node-file-utils --save


## How to use

The examples folder contains a few use cases that demonstrate how to define, instantiate and use the available utilities.  The examples below also show use.

_Note: modules use standard production level logging and must be constructed with a logger, e.g., winston, log4js, etc._

### FileCopier

	var FileCopier = require('node-file-utils').FileCopier,
		log = require('simple-node-logger').createSimipleLogger('FileCopier'),
		copier = new FileCopier( { log:log } );
		
	copier.copy('mysource', 'mydestination', function(err) {
		if (err) {
			log.error( err );
			throw err;
		}
		
		log.info('file copied...');
	});

### File Tree Walker

TreeWalker's walk method traverses a file system from a specified start point and returns a list of all files.  The find method returns files that match a specified pattern.

	var TreeWalker = require('node-file-utils').TreeWalker,
    	log = require('simple-node-logger').createSimpleLogger(),
    	walker = new TreeWalker({ log:log }),
    	callback;
    	
    callback = function(err, files) {
    	if (err) throw err;

    	files.forEach(function(file) {
        	log.info( file );
    	}); 

    	log.info( 'file list length: ', files.length );
    };

	// return all the files
	walker.walk( 'myfolder', callback );
	
	// find and return just the javascript files
	walker.find( 'myfolder', /.js$/, callback );
	
## Events

_Events will be implemented soon.  They include events that fire on complete and progress levels._

## Examples

Examples of file copier and tree walker can be found in the examples folder.

## Unit Tests

All unit tests are written in mocha/chai/should and can be run from the command line by doing this:

	make test
	
	// or
	
	make jshint
	
There is also a source file watcher that can be invoked with this:

	make watch
	
## Mocks

Mocks used for testing include MockFileSystem.  Typically you would use MockFileSystem for unit tests like this:

    var MockFileSystem = require('node-file-utils').mocks.MockFileSystem;

    var fs = new MockFileSystem();

    fs.readFile('filename', callback);

## License

Apache 2.0

- - -
<p><small><em>version 0.90.15</em></small></p>
