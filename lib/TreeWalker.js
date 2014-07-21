/**
 * @class TreeWalker
 *
 * TODO add events to trigger on each file found, each directory found, error, etc;
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/20/14 3:20 PM
 */
var path = require('path');

var TreeWalker = function(options) {
    'use strict';

    var walker = this,
        log = options.log,
        fs = options.fs || require('fs');

    /**
     * find all files in the start folder that match the pattern
     *
     * @param start - top level folder
     * @param pattern - the regexp to match
     * @param findCompleteCallback err, files
     */
    this.find = function(start, pattern, findCompleteCallback) {
        walker.walk( start, { pattern:pattern }, findCompleteCallback );
    };

    /**
     * walk the file structure from the top (start) folder and collect all files; return in callback
     *
     * @param start - the top directory to begin walk
     * @param options - optional pattern, depth, max file count
     * @param walkCompleteCallback - err, files
     */
    this.walk = function(start, options, walkCompleteCallback) {
        var files = [],
            dirs = [],
            currentDir = start,
            readDirCallback,
            readNextDir,
            pattern;

        if (typeof options === 'function') {
            walkCompleteCallback = options;
        } else if (options !== null && typeof options === 'object') {
            pattern = options.pattern;
        }

        if (typeof walkCompleteCallback !== 'function') {
            throw new Error('walk requires a callback');
        }

        log.info('read files from start dir: ', start);

        readNextDir = function(results, completeCallback) {
            results.files.forEach(function(file) {
                if (pattern) {
                    if (file.match( pattern )) {
                        files.push( file );
                    }
                } else {
                    files.push( file );
                }
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
