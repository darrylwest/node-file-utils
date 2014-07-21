/**
 * @class TreeWalkerTests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 7/20/14 3:21 PM
 */
var should = require('chai').should(),
    dash = require( 'lodash' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    TreeWalker = require( '../lib/TreeWalker' );

describe('TreeWalker', function() {
    'use strict';

    var createOptions = function() {
        var opts = {};

        opts.log = MockLogger.createLogger( 'FileWalker' );

        return opts;
    };

    describe('#instance', function() {
        var walker = new TreeWalker( createOptions() ),
            methods = [
                'walk',
                'find'
            ];

        it('should create an instance of TreeWalker', function() {
            should.exist( walker );
            walker.should.be.instanceof( TreeWalker );

        });

        it('should have all expected methods by size and type', function() {
            dash.methods( walker ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                walker[ method ].should.be.a( 'function' );
            });
        });
    });
});