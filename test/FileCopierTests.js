/**
 * @class FileCopierTests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/20/14 3:32 PM
 */
var should = require('chai').should(),
    dash = require( 'lodash' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    MockFileSystem = require('./mocks/MockFileSystem' ),
    FileCopier = require( '../lib/FileCopier' );

describe('TreeWalker', function() {
    'use strict';

    var createOptions = function() {
        var opts = {};

        opts.log = MockLogger.createLogger( 'FileWalker' );
        opts.fs = new MockFileSystem();

        return opts;
    };

    describe('#instance', function() {
        var copier = new FileCopier( createOptions() ),
            methods = [
                'copy',
                'onProgress',
                // inherited
                'addListener',
                'emit',
                'listeners',
                'on',
                'once',
                'removeAllListeners',
                'removeListener',
                'setMaxListeners'
            ];

        it('should create an instance of FileCopier', function() {
            should.exist( copier );
            copier.should.be.instanceof( FileCopier );
        });

        it('should have all expected methods by size and type', function() {
            dash.methods( copier ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                copier[ method ].should.be.a( 'function' );
            });
        });
    });
});