var Promise = require('bluebird');
var SR = require('./../lib/status-report');

var report = new SR('test', 'test-status');
Promise.delay(0).then(function(){
    return report.queued(1, '1', 'blahblah');
}).delay(100).then(function(){
    return report.processing(1, '1', 'pro');
}).delay(1000).then(function(){
    return report.completed(1, '1', 'done');
}).delay(1000).then(function(){
    return report.success();
});
