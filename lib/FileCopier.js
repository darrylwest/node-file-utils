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

        let stat = fs.statSync( src );
        let size = stat.size;
        let progressSize = 0;

        const copyFile = function() {
            let reader = fs.createReadStream(src);

            reader.on('data', function (chunk) {
                progressSize += chunk.length;

                const percent = Math.floor(progressSize * 100 / size);

                if (log.isDebug()) {
                    log.debug('size: ', progressSize, ', percent: ', percent, '%');
                }

                copier.emit(PROGRESS_EVENT, percent);
            });

            reader.on('error', function (err) {
                log.error('read error: ', err.getMessage);

                callback(err);
            });

            let opts = {
                flags: 'w',
                defaultEncoding: 'utf8',
                fd: null,
                mode: stat.mode,
                autoClose: true
            };

            let writer = fs.createWriteStream(dest, opts);
            writer.on('error', function (err) {
                log.error('write error: ', err);

                callback(err);
            });

            writer.on('close', function (err) {
                log.debug('writer close: file copied to ', dest);

                let newstat = fs.statSync(dest);

                if (newstat.size !== stat.size) {
                    let msg = ['new file size: ', newstat.size, ' does not match original: ', stat.size, ', file: ', src].join('');
                    log.error(msg);
                    err = new Error(msg);
                }

                copier.emit(COMPLETE_EVENT, newstat);

                callback(err, newstat);
            });

            // start the copy...
            reader.pipe(writer);
        };

        // if the dest is a path, check if it exists...
        if (dest.indexOf( path.sep ) < 0) {
            copyFile();
        } else {
            // first, check to see if the dest folder exists
            let folder = path.dirname( dest );
            let dirstat = fs.stat(folder, (err) => {
                if (err) {
                    log.info('create the folder: ', folder);
                    mkdirp( folder, ( err ) => {
                        if ( err ) {
                            log.error( err );
                            return callback( err );
                        }

                        copyFile();
                    } );
                } else {
                    copyFile();
                }
            } );
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

