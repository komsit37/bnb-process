var should = require('./test-lib/chai-should');
var jsf = require('jsonfile');
var moment = require('moment');

var calUtils = require('./../lib/cal-utils');

describe('Occupancy', function () {
    var cal = jsf.readFileSync('./test/data/calendar_sample.json');

    it('getDays', function () {
        var days = calUtils.getDays(cal);
        should.exist(days);
        days.should.be.instanceof(Array);
        days.length.should.be.at.least(200);
        days[0].should.contain.all.keys('date', 'available', 'type', 'subtype', 'group_id');
    });

    it('getDays with boundary', function () {
        var start = '2015-09-04';
        var end = '2015-11-04';
        var days = calUtils.getDays(cal, moment(start), moment(end));
        //console.log(days.length);
        should.exist(days);
        days.should.be.instanceof(Array);
        days.length.should.equal(62);
        //console.log(days[0]);
        days[0].should.contain.all.keys('date', 'available', 'type', 'subtype', 'group_id', 'price');
        days[0].date.should.be.like(start);
        days[days.length - 1].date.should.be.like(end);
    });

    it('can get occupancy', function () {
        var occ = calUtils.occupancy(cal);
        should.exist(occ);
        occ.should.be.like({ reservation: 30,
            available: 28,
            busy: 3,
            reservation_rate: 0.49,
            available_rate: 0.46,
            busy_rate: 0.05,
            total: 61 });
    });
});

