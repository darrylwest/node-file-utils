/**
 * @class TreeWalker
 *
 * TODO add events to trigger on each file found, each directory found, error, etc;
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/20/14 3:20 PM
 */
var path = require('path' ),
    dash = require('lodash');

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
        log.info('find using pattern: ', pattern);
        walker.walk( start, { pattern:pattern }, findCompleteCallback );
    };

    /**
     * find all files older than the specified date
     *
     * @param start - top directory
     * @param olderThanDate - date type ; will throw if not a date
     * @param findCompleteCallback
     */
    this.findOlder = function(start, olderThanDate, findCompleteCallback) {
        // validate that older than date is a date
        if (!dash.isDate( olderThanDate )) throw new Error('olderThan variable must be a date');

        log.info('find files older than: ', olderThanDate);
        walker.walk( start, { older:olderThanDate }, findCompleteCallback );
    };

    /**
     * walk the file structure from the top (start) folder and collect all files; return in callback
     *
     * @param start - the top directory to begin walk
     * @param options - optional pattern, depth, newer, older, max file count
     * @param walkCompleteCallback - err, files
     */
    this.walk = function(start, options, walkCompleteCallback) {
        var files = [],
            dirs = [],
            currentDir = start,
            readDirCallback,
            readNextDir,
            pattern,
            readStats = false,
            older,
            newer,
            maxSize;

        if (typeof options === 'function') {
            walkCompleteCallback = options;
        } else if (options !== null && typeof options === 'object') {
            pattern = options.pattern;
            older = options.older;
        }

        if (typeof walkCompleteCallback !== 'function') {
            throw new Error('walk requires a callback');
        }

        readStats = (older || newer || maxSize);
        log.debug('read files from start dir: ', start);

        readNextDir = function(results, completeCallback) {
            results.files.forEach(function(file) {
                var stats;

                if (pattern) {
                    if (!file.match( pattern )) {
                        return;
                    }
                }

                if (readStats) {
                    stats = fs.statSync( file );
                }

                if (older) {
                    if (stats.mtime.getTime() > older.getTime()) {
                        return;
                    }
                }

                if (newer) {
                    if (stats.mtime.getTime() < newer.getTime()) {
                        return;
                    }
                }

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
