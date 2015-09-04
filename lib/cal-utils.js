var moment = require('moment');
var _ = require('lodash');
var ss = require('simple-statistics');

//todo: standardize date interface

function getDays(cal, duration_or_to, from) {
    from = from || cal.timestamp;
    duration_or_to = duration_or_to || '2M';
    var to = _getTo(from, duration_or_to);
    return _getDays(cal, from, to);
}

function occupancy(cal, duration_or_to, from) {
    var days = getDays(cal, duration_or_to, from);

    var occ = _.countBy(days, function (day) {
        return day.type
    });
    _.forOwn(occ, function (value, key) {
        occ[key + '_rate'] = _round(value / days.length);
    });
    occ.total = days.length;

    return occ;
}

function avail_price(cal, duration_or_to, from) {
    var days = getDays(cal, duration_or_to, from);

    var prices = [];
    _.map(days, function (day) {
        if (day.price) prices.push(day.price.local_price)
    });

    return {
        avg: _round(ss.mean(prices)),
        std: _round(ss.standardDeviation(prices)),
        count: prices.length
    };
}

function all(cal, duration_or_to, from) {
    var days = getDays(cal, duration_or_to, from);
    var avail = avail_price(cal, duration_or_to, from);
    var occ = occupancy(cal, duration_or_to, from);

    return {
        avail_price: avail,
        occupancy: occ,
        revpar: revpar(avail, occ)
    }
}

function revpar(avail_price, occ) {
    return {
        avail_price: avail_price.avg,
        occupancy: occ.reservation_rate,
        revpar: _round(avail_price.avg * occ.reservation_rate), //exclude busy in normal case, coz it's not real booking
        revpar_all: _round(avail_price.avg * (occ.reservation_rate + occ.busy_rate))    //it may mean offline booking tho, so add here just in case
    }

}


module.exports.occupancy = occupancy;
module.exports.avail_price = avail_price;
module.exports.all = all;
module.exports.revpar = revpar;
module.exports.getDays = getDays;

module.exports._getDays = _getDays;


//------------------------------- private -------------------------
function _round(x) {
    return Math.round(100 * x) / 100
};

var DURATION_PATTERN = /(\d+)(\D$)/;    //i.e. 3M, 10d
function _getTo(from, duration_or_to) {
    var to;
    var durationParts = DURATION_PATTERN.exec(duration_or_to);
    if (durationParts) {
        to = moment(from).add(durationParts[1], durationParts[2]);
    } else {
        to = moment(duration_or_to);
    }
    return to;
}

function _getDays(cal, from, to) {
    var fromM = moment(from);
    var toM = moment(to);
    //console.log(cal.calendar_months);
    return _(cal.calendar_months)
        .pluck('days')
        .flatten()
        .filter(function (day) {
            if (fromM && fromM.isAfter(day.date)) return false;
            if (toM && toM.isBefore(day.date)) return false;
            return true;
        })
        .uniq(false, 'date')    //prevent overlap dates in the calendar
        .value();
}
/*
 sample data of 3 types
 1. available
 {
 "date": "2015-10-02",
 "available": true,
 "type": "available",
 "subtype": null,
 "group_id": null
 }
 2. booked
 {
 "date": "2015-09-25",
 "available": false,
 "type": "reservation",
 "subtype": null,
 "group_id": "reservation:55099443"
 }
 3. busy
 {
 "date": "2015-09-29",
 "available": false,
 "type": "busy",
 "subtype": "host_busy",
 "group_id": "busy"
 }
 */