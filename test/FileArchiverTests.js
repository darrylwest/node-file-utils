/**
 * @class FileArchiverTests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 2/26/15 3:07 PM
 */
const should = require('chai').should(),
    dash = require( 'lodash' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    MockFileSystem = require('./mocks/MockFileSystem' ),
    FileArchiver = require( '../lib/FileArchiver' );

describe('FileArchiver', function() {
    'use strict';

    const createOptions = function() {
        var opts = {};

        opts.log = MockLogger.createLogger( 'FileArchiver' );
        opts.fs = new MockFileSystem();

        return opts;
    };

    describe('#instance', function() {
        const archiver = new FileArchiver( createOptions() ),
            methods = [
                'purge',
                'onProgress',
                'onComplete',
                'onError'
            ];

        it('should create an instance of FileArchiver', function() {
            should.exist( archiver );
            archiver.should.be.instanceof( FileArchiver );
        });

        it('should have all expected methods by size and type', function() {
            dash.functions( archiver ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                archiver[ method ].should.be.a( 'function' );
            });
        });
    });


});
