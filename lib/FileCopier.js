/**
 * @class FileCopier
 *
 * TODO add events for progress, complete, error, etc
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/20/14 3:31 PM
 */
const util = require('util' ),
    events = require('events');

const FileCopier = function(options) {
    'use strict';

    const copier = this,
        log = options.log,
        fs = options.fs || require('fs' ),
        PROGRESS_EVENT = 'progress_event';

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
            callback( err );
        });

        let opts = {
            flags: 'w',
            defaultEncoding: 'utf8',
            fd: null,
            mode: stat.mode,
            autoClose: true
        };

        let writer = fs.createWriteStream( dest, opts );
        reader.on('error', function(err) {
            log.error('write error: ', err.getMessage);
            callback( err );
        });

        writer.on('close', function(err) {
            log.debug('file copied to ', dest);
            callback( err );
        });

        // start the copy...
        reader.pipe( writer );
    };

    /**
     * progress events are fired when new data arrives
     * @param handler - percent complete...
     */
    this.onProgress = function(handler) {
        log.debug('add progress event handler');
        copier.on( PROGRESS_EVENT, handler );
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

