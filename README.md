# Node File Utils
- - -

[![NPM version](https://badge.fury.io/js/node-file-utils.svg)](http://badge.fury.io/js/node-file-utils)
[![Build Status](https://travis-ci.org/darrylwest/node-file-utils.svg?branch=master)](https://travis-ci.org/darrylwest/node-file-utils)
[![Dependency Status](https://david-dm.org/darrylwest/node-file-utils.svg)](https://david-dm.org/darrylwest/node-file-utils)

A simple set of file utility and mock classes.  Modules are a stand-alone class-like objects constructed with injected variable options.  The intent is to provide small specific helpers to solve typical linux/unix file system problems.

## Installation

    npm install node-file-utils --save

## How to use

The examples folder contains a few use cases that demonstrate how to define, instantiate and use the available utilities.  The examples below also show use.

_Note: modules use standard production level logging and must be constructed with a logger, e.g., winston, log4js, etc._

### FileCopier

FileCopier copies the original contents and the file's mode from source to destination.  The destination path must exist prior to a copy. (_use a mkdirp utility for that_)

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
	
### File Copy Events

File copy has a progress event that fires when data arrives in chunks.  A simple progress percentage is fired for this event.

	var progressHandler = function(percent) {
		log.info('percent complete: ', percent, '%');
	};
	
	copier.onProgress( progressHandler );

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
	
### Tree Walker Events

Events are triggered by TreeWalker when a new folder or file is located.  Files that are skipped based on age or pattern don't trigger events.  All new folders trigger events.


#### onDirectory

When a new directory is located a 'onDirectory' event is fired.  The event handler receives the director's path.

	var directoryHandler = function(path) {
		log.info( 'new folder: ', path );
	};
	
	walker.onDirectory( directoryHandler );

#### onFile

When a new file is added to the list a 'onFile' event is fired with the file's full path.

	var fileHandler = function(path) {
		log.info( 'new file: ', path );
	};
	
	walker.onFile( fileHandler );
	

### FileArchiver

A simple example of a file purge based on files older than 30 days.

	var FileArchiver = require('node-file-utils'). FileArchiver,
    	archiver = FileArchiver.createInstance(),
    	config = {
    		folders:[ 'logs/' ],
    		cwd: process.env.HOME,
    		olderThanDays: 30
    	};
    	
   archiver.onProgress(function(err, file) {
   		console.log('file removed: ', file);
   });
   
   archiver.onComplete(function() {
   		console.log('archive/purge complete...');
   });
   
   archiver.purge( config );

## Examples

Examples of file copier and tree walker can be found in the examples folder. The javascript scripts can be run like this:

	node examples/file-copy.js
	
	// and
	
	node examples/tree-walker.js
	
	// or
	
	node examples/purge-files.js

## Unit Tests

All unit tests are written in mocha/chai/should and can be run from the command line by doing this:

	make test
	
	// or
	
	make jshint
	
	// or
	
	npm test
	
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
<p><small><em>copyright 2014-2016 © rain city software | version 0.91.14</em></small></p>
