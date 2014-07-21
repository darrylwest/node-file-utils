# Node File Utils
- - -

A simple set of file utility and mock classes.


## Installation

    npm install node-file-utils --save


## How to use

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

	var TreeWalker = require('../lib/TreeWalker'),
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

## Examples

Examples of file copier and tree walker can be found in the examples folder.

## Unit Tests

All unit tests are written in mocha/chai/should and can be run from the command line by doing this:

	make test
	
There is also a file watcher that can be invoked with this:

	make watch
	
## Mocks

Mocks used for testing include MockFileSystem.  Typically you would use MockFileSystem for unit tests like this:

    var MockFileSystem = require('node-file-utils').MockFileSystem;

    var fs = new MockFileSystem();

    fs.readFile('filename', callback);

## License

Apache 2.0

- - -
<p><small><em>version 0.90.12</em></small></p>
