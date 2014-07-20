/**
 * @class FileCopier
 *
 * TODO add events for complete, error, etc
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/20/14 3:31 PM
 */
var FileCopier = function(options) {
    'use strict';

    var copier = this,
        log = options.log,
        fs = options.fs || require('fs');

    this.copy = function(src, dest, callback) {
        log.debug( 'copy ', src, ' to ', dest );

        var reader,
            writer;

        reader = fs.createReadStream( src );
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
};

module.exports = FileCopier;

