var should = require('./test-lib/chai-should');
var jsf = require('jsonfile');

var calUtils = require('./../lib/cal-utils');

describe('getDays', function () {
    var cal = jsf.readFileSync('./test/data/calendar_sample.json');

    it('default (no arg)', function () {
        var days = calUtils.getDays(cal);
        should.exist(days);
        days.should.be.instanceof(Array);
        days.length.should.be.at.least(50);
        days[0].should.contain.all.keys('date', 'available', 'type', 'subtype', 'group_id');
    });

    it('with duration', function () {
        var days = calUtils.getDays(cal, '1M');
        //console.log(days.length);
        should.exist(days);
        days.should.be.instanceof(Array);
        days.length.should.be.within(27, 31);
        //console.log(days[0]);
        days[0].should.contain.all.keys('date', 'available', 'type', 'subtype', 'group_id', 'price');
        //todo: check first date is same as first day
    });

    it('with to/from', function () {
        var start = '2015-09-04';
        var end = '2015-11-04';
        var days = calUtils.getDays(cal, end, start);
        //console.log(days.length);
        should.exist(days);
        days.should.be.instanceof(Array);
        days.length.should.equal(62);
        //console.log(days[0]);
        days[0].should.contain.all.keys('date', 'available', 'type', 'subtype', 'group_id', 'price');
        days[0].date.should.be.like(start);
        days[days.length - 1].date.should.be.like(end);
    });
});

