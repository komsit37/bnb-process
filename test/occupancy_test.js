var should = require('./test-lib/chai-should');
var jsf = require('jsonfile');
var moment = require('moment');

var calUtils = require('./../lib/cal-utils');

describe('Occupancy', function () {
    var cal = jsf.readFileSync('./test/data/calendar_sample.json');

    it('can get occupancy', function () {
        var occ = calUtils.occupancy(cal);
        console.log(occ);
        should.exist(occ);
        occ.should.be.like({ reservation: 30,
            available: 28,
            busy: 3,
            reservation_rate: 0.49,
            available_rate: 0.46,
            busy_rate: 0.05,
            total: 61
        });
    });

    var duration = '1M';
    it('can get occupancy (' + duration + ')', function () {
        var occ = calUtils.occupancy(cal, duration);
        console.log(occ);
        should.exist(occ);
        occ.should.be.like({
            available: 5,
            available_rate: 0.17,
            busy: 3,
            busy_rate: 0.1,
            reservation: 22,
            reservation_rate: 0.73,
            total: 30
        });
    });
});

