var should = require('./test-lib/chai-should');
var jsf = require('jsonfile');

var calUtils = require('./../lib/cal-utils');

describe('Price', function () {
    var cal = jsf.readFileSync('./test/data/calendar_sample.json');

    it('available price', function () {
        var availPrice = calUtils.availablePrice(cal);
        console.log(availPrice);
        availPrice.should.contain.keys('timestamp', 'duration', 'avg', 'std', 'count');
        availPrice.should.be.like({ timestamp: '2015-09-04T11:02:41.212Z',
            duration: '2M',
            avg: 150.32,
            std: 9.29,
            count: 28 })
    });


});

