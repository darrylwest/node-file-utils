/**
 * @class FileArchiver
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 2/26/15 3:11 PM
 */
var util = require('util' ),
    events = require('events');

var FileArchiver = function(options) {
    'use strict';

    var archiver = this,
        log = options.log,
        fs = options.fs || require( 'fs' ),
        PROGRESS_EVENT = 'progress_event';

    events.EventEmitter.call( this );

    this.purge = function(file, callback) {
        log.info( 'purge file: ', file );
    };

    this.onProgress = function(handler) {
        log.debug('add progress handler to archiver');
        archiver.on( PROGRESS_EVENT, handler );
    };

    // constructor tests
    if (!log) throw new Error('file archiver must be constructed with a logger');
};

util.inherits( FileArchiver, events.EventEmitter );

FileArchiver.createInstance = function(opts) {
    'use strict';

    if (!opts) {
        // read the standard archive config
    }

    if (!opts.log) {
        opts.log = require('simple-node-logger' ).createSimpleLogger();
    }

    return new FileArchiver( opts );
};

module.exports = FileArchiver;
