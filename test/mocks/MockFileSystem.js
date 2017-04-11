/**
 * @class MockFileSystem
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 1/20/14 11:39 AM
 */
const dash = require('lodash');
const stream = require('stream');

const MockFileSystem = function() {
    'use strict';

    const writer = this;

    this.filename = null;
    this.data = null;

    this.appendFile = function(filename, data, callback) {
        if (!filename) throw new Error('appendFile requires a filename, found null');
        if (!data) throw new Error('appendFile requires data, found null');
        if (!callback) throw new Error('appendFile requires callback, found null');

        writer.filename = filename;
        writer.data += data;

        process.nextTick( function() {
            callback( null );
        });
    };

    this.truncate = function(path, size, callback) {
        if (!path) throw new Error('truncate requires a filename/path');
        if (size && typeof size === 'function') callback = size;

        this.data = '';
        this.filename = path;

        process.nextTick( function() {
            callback( null );
        });
    };

    this.rename = function(oldPath, newPath, callback) {
        if (!oldPath) throw new Error('rename requires an old path name');
        if (!newPath) throw new Error('rename requires a new path name');
        if (!callback) throw new Error('rename requires a callback');

        this.filename = newPath;
        process.nextTick( function() {
            callback( null );
        });
    };

    this.writeFile = function(filename, data, opts, callback) {
        if (!filename) throw new Error('writeFile requires a filename');
        if (!data) throw new Error('writeFile requires data');
        if (!opts) throw new Error('writeFile requires a callback');

        if (typeof opts === 'function') {
            callback = opts;
        }

        this.filename = filename;
        process.nextTick( function() {
            callback( null, {} );
        });
    };

    this.createWriteStream = function(filename, opts) {
        const ws = new stream.Writable({
            write(chunk, enc, cb) {
                cb();
            }
        });

        return ws;
    };
};

module.exports = MockFileSystem;
