#!/usr/bin/env node

var FileCopier = require('../lib/FileCopier'),
    copier = FileCopier.createInstance(),
    src = __dirname + '/big-file.txt',
    dest = __dirname + '/copied-file.log';

console.log('copy file...');

copier.onProgress(function(percent) {
    console.log('complete: ', percent, '%');
});

copier.copy( src, dest, function(err) {
    if (err) throw err;

    console.log('file ', src, ' copied to ', dest);
});

