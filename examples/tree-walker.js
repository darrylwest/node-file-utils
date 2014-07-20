#!/usr/bin/env node

var TreeWalker = require('../lib/TreeWalker'),
    log = require('simple-node-logger').createSimpleLogger(),
    walker = new TreeWalker({ log:log });

log.info('walk a known folder' );

walker.walk( __dirname + '/../test', function(err, files) {
    if (err) throw err;

    files.forEach(function(file) {
        log.info( file );
    });

    log.info( 'file list length: ', files.length );
});

