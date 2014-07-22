/**
 * @class FileCopier
 *
 * TODO add events for progress, complete, error, etc
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/20/14 3:31 PM
 */
var util = require('util' ),
    events = require('events');

var FileCopier = function(options) {
    'use strict';

    var copier = this,
        log = options.log,
        fs = options.fs || require('fs');

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

        var reader,
            writer,
            size = 0,
            progressSize = 0;

        reader = fs.createReadStream( src );

        // get the size of the source
        size = fs.statSync( src ).size;

        reader.on('data', function(chunk) {
            progressSize += chunk.length;

            var percent = Math.round( progressSize * 100 / size );

            log.debug('size: ', progressSize, ', percent: ', percent, '%');

            copier.emit('progress', percent);
        });

        reader.on('error', function(err) {
            log.error('read error: ', err.getMessage);
            callback( err );
        });

        writer = fs.createWriteStream( dest );
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

    // constructor tests
    if (!log) throw new Error('file copier must be constructed with a logger');
};

util.inherits( FileCopier, events.EventEmitter );

module.exports = FileCopier;

