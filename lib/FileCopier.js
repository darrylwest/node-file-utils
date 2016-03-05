/**
 * @class FileCopier
 *
 * TODO add events for progress, complete, error, etc
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/20/14 3:31 PM
 */
const util = require('util' ),
    events = require('events'),
    path = require('path' ),
    mkdirp = require('mkdirp');

const FileCopier = function(options) {
    'use strict';

    const copier = this,
        log = options.log,
        fs = options.fs || require('fs' ),
        PROGRESS_EVENT = 'copy_progress_event',
        COMPLETE_EVENT = 'copy_complete_event';

    events.EventEmitter.call( this );

    /**
     * copy source file to destination file
     *
     * @param src - path to the source file
     * @param dest - path to the destination file
     * @param callback
     */
    this.copy = function(src, dest, callback) {
        log.debug( 'copy ', src, ' to ', dest );

        let reader = fs.createReadStream( src );

        let stat = fs.statSync( src );
        let size = stat.size;
        let progressSize = 0;

        reader.on('data', function(chunk) {
            progressSize += chunk.length;

            const percent = Math.floor( progressSize * 100 / size );

            log.debug('size: ', progressSize, ', percent: ', percent, '%');

            copier.emit( PROGRESS_EVENT, percent );
        });

        reader.on('error', function(err) {
            log.error('read error: ', err.getMessage);

            if (typeof callback === 'function') {
                callback( err );
            }
        });

        const createFile = function(err) {
            if (err) {
                log.error( err );
                return callback( err );
            }

            let opts = {
                flags: 'w',
                defaultEncoding: 'utf8',
                fd: null,
                mode: stat.mode,
                autoClose: true
            };

            let writer = fs.createWriteStream( dest, opts );
            reader.on('error', function(err) {
                log.error('write error: ', err);
                callback( err );
            });

            writer.on('finish', function(err) {
                log.debug('file copied to ', dest);

                let newstat = fs.statSync( dest );

                if (newstat.size !== stat.size) {
                    let msg = [ 'new file size: ', newstat.size, ' does not match original: ', stat.size,  ', file: ', src ].join('');
                    log.error( msg );
                    err = new Error( msg );
                }

                if (typeof callback === 'function') {
                    callback( err, newstat );
                }

                if (!err) {
                    copier.emit( COMPLETE_EVENT, newstat );
                }
            });

            // start the copy...
            reader.pipe( writer );
        };

        // if the dest is a path, check if it exists...
        if (dest.indexOf( path.sep ) < 0) {
            setImmediate( createFile );
        } else {
            let folder = path.dirname( dest );

            mkdirp( folder, createFile );
        }
    };

    /**
     * progress events are fired when new data arrives
     * @param handler - percent complete...
     */
    this.onProgress = function(handler) {
        log.debug('add progress event handler');
        copier.on( PROGRESS_EVENT, handler );
    };

    this.onComplete = function(handler) {
        log.info('copy complete...');
        copier.on( COMPLETE_EVENT, handler );
    };

    // constructor tests
    if (!log) throw new Error('file copier must be constructed with a logger');
};

util.inherits( FileCopier, events.EventEmitter );

FileCopier.createInstance = function(opts) {
    'use strict';

    if (!opts) opts = {};

    if (!opts.log) {
        opts.log = require('simple-node-logger').createSimpleLogger();
    }

    return new FileCopier( opts );
};

module.exports = FileCopier;

