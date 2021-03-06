/**
 * @class FileCopierTests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/20/14 3:32 PM
 */
const should = require('chai').should(),
    dash = require( 'lodash' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    MockFileSystem = require('./mocks/MockFileSystem' ),
    FileCopier = require( '../lib/FileCopier' );

describe('FileCopier', function() {
    'use strict';

    const createOptions = function() {
        const opts = {};

        opts.log = MockLogger.createLogger( 'FileCopier' );
        opts.fs = new MockFileSystem();

        return opts;
    };

    describe('#instance', function() {
        const copier = new FileCopier( createOptions() ),
            methods = [
                'copy',
                'onProgress',
                'onComplete'
            ];

        it('should create an instance of FileCopier', function() {
            should.exist( copier );
            copier.should.be.instanceof( FileCopier );
        });

        it('should have all expected methods by size and type', function() {
            dash.functions( copier ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                copier[ method ].should.be.a( 'function' );
            });
        });
    });
});
