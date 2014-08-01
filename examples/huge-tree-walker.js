#!/usr/bin/env node

// example of an events only walker; use this to walk huge trees and operate on each file one at a time; not as
// good as streams, but close

var TreeWalker = require('../lib/TreeWalker'),
    log = require('simple-node-logger').createSimpleLogger(),
    walker = new TreeWalker({ log:log }),
    hugeFolder = 'YOUR-HUGE-FILE-SYSTEM';

walker.onFile(function(file) {
    log.info( file );
});

walker.walk( hugeFolder, { eventsOnly:true }, function(err, count) {
    if (err) throw err;

    log.info( 'walk list size: ', count );
});

