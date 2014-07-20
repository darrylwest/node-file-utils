/**
 * @class TreeWalker
 *
 * TODO add events to trigger on each file found, each directory found, error, etc;
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/20/14 3:20 PM
 */
var path = require('path'),
    fs = require('fs');

var TreeWalker = function(options) {
    'use strict';

    var walker = this,
        log = options.log;

    this.walk = function(start, walkCompleteCallback) {
        var files = [],
            dirs = [],
            currentDir = start,
            readDirCallback,
            readNextDir;

        log.info('read files from start dir: ', start);

        readNextDir = function(results, completeCallback) {
            results.files.forEach(function(file) {
                files.push( file );
            });

            if (results.dirs.length > 0) {
                results.dirs.forEach(function(dir) {
                    dirs.push( dir );
                });
            }

            if (dirs.length > 0) {
                currentDir = dirs.pop();
                fs.readdir( currentDir, readDirCallback );
            } else {
                return completeCallback( null, files );
            }
        };

        readDirCallback = function(err, files) {
            if (err) return walkCompleteCallback( err );

            var fileList = [],
                dirList = [],
                fullList;

            files.forEach(function(name) {
                var fullPath = path.join( currentDir, name );
                if (fs.statSync( fullPath ).isDirectory()) {
                    dirList.push( fullPath );
                } else {
                    fileList.push( fullPath );
                }
            });

            fullList = {
                dirs:dirList,
                files:fileList
            };

            readNextDir( fullList, walkCompleteCallback );
        };

        fs.readdir( currentDir, readDirCallback );
    };

    // constructor tests
    if (!log) throw new Error('walker must be constructed with a logger');
};

module.exports = TreeWalker;
