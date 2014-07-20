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
        var manager = new TreeWalker( createOptions() ),
            methods = [
                'walk'
            ];

        it('should create an instance of TreeWalker', function() {
            should.exist( manager );
            manager.should.be.instanceof( TreeWalker );

        });

        it('should have all expected methods by size and type', function() {
            dash.methods( manager ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                manager[ method ].should.be.a( 'function' );
            });
        });
    });
});