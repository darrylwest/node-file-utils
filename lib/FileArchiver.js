/**
 * @class FileArchiver
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 2/26/15 3:11 PM
 */
var util = require('util' ),
    events = require( 'events' ),
    dash = require( 'lodash' ),
    path = require( 'path' ),
    TreeWalker = require( './TreeWalker' );

var FileArchiver = function(options) {
    'use strict';

    var archiver = this,
        log = options.log,
        fs = options.fs || require( 'fs' ),
        PROGRESS_EVENT = 'archiverProgressEvent',
        COMPLETE_EVENT = 'archiverCompleteEvent';

    events.EventEmitter.call( this );

    this.purge = function(config, callback) {
        log.info( 'purge config: ', config );

        var days = 180,
            walker = new TreeWalker( { log:log } ),
            removeFiles,
            dir,
            folders,
            loop,
            older;

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

        removeFiles = function(files, callback) {
            var stats;

            while (files.length > 0) {
                var file = files.shift(),
                    stats = fs.statSync( file );

                log.info('purge file: ', file);
                fs.unlinkSync( file );

                archiver.emit( PROGRESS_EVENT, file );
            }

        };

        loop = function() {
            var folder = folders.pop();

            if (folder) {
                walker.findOlder( path.join( dir, folder ), older, function(err, files) {
                    if (err) {
                        log.error( err );
                    } else {
                        log.info('purge files: ', files);

                        removeFiles( files );
                    }
                });
            } else {
                archiver.emit( COMPLETE_EVENT, 'purge' );
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
