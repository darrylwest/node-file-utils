#!/usr/bin/env node

// dpw@alameda.local
// 2015.02.26
'use strict';

var FileArchiver = require('../index').FileArchiver,
    config = require('./purge-spec').readConfig(),
    archiver = FileArchiver.createInstance();

console.log( config );

archiver.purge( config );

