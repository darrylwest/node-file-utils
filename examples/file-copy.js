#!/usr/bin/env node

var FileCopier = require('../lib/FileCopier'),
    log = require('simple-node-logger').createSimpleLogger(),
    copier = new FileCopier( { log:log } ),
    src = __dirname + '/big-file.txt',
    dest = __dirname + '/copied-file.log';

log.info('copy file...');

copier.copy( src, dest, function(err) {
    if (err) throw err;

    log.info('file ', src, ' copied to ', dest);
});

