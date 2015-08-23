var should = require('./test-lib/chai-should');

describe('App', function () {
    it('can be imported', function () {
        var app = require('../index');
        should.exist(app);
    });
});