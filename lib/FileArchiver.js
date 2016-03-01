/**
 * @class FileArchiver
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 2/26/15 3:11 PM
 */
const util = require('util' ),
    events = require( 'events' ),
    dash = require( 'lodash' ),
    path = require( 'path' ),
    TreeWalker = require( './TreeWalker' );

const FileArchiver = function(options) {
    'use strict';

    const archiver = this,
        log = options.log,
        fs = options.fs || require( 'fs' ),
        PROGRESS_EVENT = 'archiverProgressEvent',
        COMPLETE_EVENT = 'archiverCompleteEvent',
        ERROR_EVENT = 'archiverErrorEvent';

    events.EventEmitter.call( this );

    this.purge = function(config, completeCallback) {
        log.info( 'purge config: ', config );

        let days = 180,
            walker = new TreeWalker( { log:log } ),
            dir,
            folders,
            older,
            fileList = [],
            errors = [];

        if (!config) {
            throw new Error('purge requires a configuration spec');
        }

        if (!config.folders) {
            throw new Error('purge config requires a folders spec');
        }

        if (config.olderThanDays) {
            days = config.olderThanDays;
        }

        folders = dash.clone( config.folders );
        older = new Date( Date.now() - days * 1000 * 60 * 60 * 24 );
        log.info('purge files older than: ', older);

        dir = config.cwd || process.env.HOME;

        const removeFiles = function(files, callback) {
            const nextFile = function() {
                let file = files.shift(),
                    stats;

                if (file) {
                    stats = fs.statSync( file );

                    log.info('purge file: ', file);
                    fs.unlink( file, function(err) {
                        if (err) {
                            log.error( err );
                            errors.push( err.message );
                        } else {
                            fileList.push( file );

                            archiver.emit( PROGRESS_EVENT, file );

                            nextFile();
                        }
                    });


                } else {
                    callback();
                }
            };

            nextFile();
        };

        const loop = function() {
            let folder = folders.pop();

            if (folder) {
                walker.findOlder( path.join( dir, folder ), older, function(err, files) {
                    if (err) {
                        log.error( err );
                        errors.push( err.message );
                    } else {
                        log.info('purge files: ', files);

                        removeFiles( files, loop );
                    }
                });
            } else {
                archiver.emit( COMPLETE_EVENT, fileList );

                if (typeof completeCallback === 'function') {
                    let err;

                    if (errors.length > 0) {
                        err = new Error( errors.join('; '));
                    }

                    completeCallback( err, fileList );
                }
            }
        };

        loop();
    };

    this.onProgress = function(handler) {
        log.debug('add progress handler to archiver');
        archiver.on( PROGRESS_EVENT, handler );
    };

    this.onComplete = function(handler) {
        log.debug('add complete handler');
        archiver.on( COMPLETE_EVENT, handler );
    };

    this.onError = function(handler) {
        log.debug('add error handler');
        archiver.on( ERROR_EVENT, handler );
    };

    // constructor tests
    if (!log) throw new Error('file archiver must be constructed with a logger');
};

util.inherits( FileArchiver, events.EventEmitter );

FileArchiver.createInstance = function(opts) {
    'use strict';

    if (!opts) {
        opts = {};
    }

    if (!opts.log) {
        opts.log = require('simple-node-logger' ).createSimpleLogger();
    }

    return new FileArchiver( opts );
};

module.exports = FileArchiver;
