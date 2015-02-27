
module.exports.TreeWalker = require('./lib/TreeWalker');
module.exports.FileCopier = require('./lib/FileCopier');
module.exports.FileArchiver = require('./lib/FileArchiver');

module.exports.mocks = {
    MockFileSystem:require('./test/mocks/MockFileSystem')
};
