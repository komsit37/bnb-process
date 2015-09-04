var should = require('./test-lib/chai-should');
var jsf = require('jsonfile');

var calUtils = require('./../lib/cal-utils');

describe('Price', function () {
    var cal = jsf.readFileSync('./test/data/calendar_sample.json');

    it('available price', function () {
        var avail_price = calUtils.avail_price(cal);
        console.log(avail_price);
        avail_price.should.contain.keys('avg', 'std', 'count');
        avail_price.should.be.like({
            avg: 150.32,
            std: 9.29,
            count: 28 })
    });

    it('revpar', function () {
        var revpar = calUtils.revpar({avg: 100}, {reservation_rate: 0.49,busy_rate: 0.05});
        console.log(revpar);
        revpar.should.contain.keys('avail_price', 'occupancy', 'revpar', 'revpar_all');
        revpar.should.be.like({ avail_price: 100, occupancy: 0.49, revpar: 49, revpar_all: 54 })
    });

    it('all', function () {
        var all = calUtils.all(cal);
        console.log(all);
        all.revpar.should.contain.keys('avail_price', 'occupancy', 'revpar', 'revpar_all');
        all.should.be.like({
            avail_price: { avg: 150.32, std: 9.29, count: 28 },
            occupancy:
            { reservation: 30,
                available: 28,
                busy: 3,
                reservation_rate: 0.49,
                available_rate: 0.46,
                busy_rate: 0.05,
                total: 61 },
            revpar:
            { avail_price: 150.32,
                occupancy: 0.49,
                revpar: 73.66,
                revpar_all: 81.17 } })
    });


});

