
// dpw 2015.02.26
'use strict';

module.exports.readConfig = function() {
    var config = {
        folders:[ 'logs/' ],
        cwd: process.env.HOME,
        olderThanDays: 3,
        actions:[ 'unlink' ] // 'unlink', { mv:[ 'target/' ] }, { archive:'backup-<date>.tgz' }
    };

    return config;
};
