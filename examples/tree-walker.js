#!/usr/bin/env node

var TreeWalker = require('../lib/TreeWalker'),
    walker = TreeWalker.createInstance();

walker.onDirectory(function(path) {
    console.log('new directory found: ', path);
});

walker.onFile(function(file) {
    console.log('new file found: ', file);
});

walker.walk( __dirname + '/../test', function(err, files) {
    if (err) throw err;

    files.forEach(function(file) {
        console.log( file );
    });

    console.log( 'walk list length: ', files.length );
});

walker.find( __dirname + '/../test', /Mock/, function(err, files) {
    if (err) throw err;

    files.forEach(function(file) {
        console.log( file );
    });

    console.log( 'find list length: ', files.length );
});

