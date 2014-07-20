# Node File Utils
- - -

A simple set of file utility classes.


## Installation

    npm install node-file-utils --save


## How to use

### FileCopier

### File Tree Walker

## Examples

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
<p><small><em>version 0.90.10</em></small></p>
