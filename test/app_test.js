var should = require('./test-lib/chai-should');
var jsf = require('jsonfile');
var moment = require('moment');

var calUtils = require('./../lib/cal-utils');

describe('App', function () {
    var cal = jsf.readFileSync('./test/data/calendar_sample.json');

    it('getDays', function () {
        var days = calUtils.getDays(cal);
        should.exist(days);
        days.should.be.instanceof(Array);
        days.length.should.be.at.least(200);
        days[0].should.contain.all.keys('date', 'available', 'type', 'subtype', 'group_id');
    });

    it('getDays with boundary', function () {
        var days = calUtils.getDays(cal, moment('2015-08-25').utc(), moment('2015-10-25').utc());
        //console.log(days.length);
        should.exist(days);
        days.should.be.instanceof(Array);
        days.length.should.equal(62);
        //console.log(days[0]);
        days[0].should.contain.all.keys('date', 'available', 'type', 'subtype', 'group_id');
        days[0].date.should.be.like('2015-08-25');
        days[days.length - 1].date.should.be.like('2015-10-25');
    });

    it('can get occupancy', function () {
        var occ = calUtils.occupancy(cal);
        should.exist(occ);
        occ.should.be.like({ reservation: 38,
            available: 20,
            busy: 3,
            reservation_rate: 0.62,
            available_rate: 0.33,
            busy_rate: 0.05,
            total: 61 });
    });
});

