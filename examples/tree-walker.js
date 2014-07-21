#!/usr/bin/env node

var TreeWalker = require('../lib/TreeWalker'),
    log = require('simple-node-logger').createSimpleLogger(),
    walker = new TreeWalker({ log:log });

walker.walk( __dirname + '/../test', function(err, files) {
    if (err) throw err;

    files.forEach(function(file) {
        log.info( file );
    });

    log.info( 'walk list length: ', files.length );
});

walker.find( __dirname + '/../test', /Mock/, function(err, files) {
    if (err) throw err;

    files.forEach(function(file) {
        log.info( file );
    });

    log.info( 'find list length: ', files.length );
});

