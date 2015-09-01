var moment = require('moment');
var _ = require('lodash');

//todo: standardize date interface
function getDays(cal, from, to) {
    //console.log(cal.calendar_months);
    return _(cal.calendar_months)
        .pluck('days')
        .flatten()
        .filter(function (day) {
            if (from && from.isAfter(day.date)) return false;
            if (to && to.isBefore(day.date)) return false;
            return true;
        })
        .uniq(false, 'date')    //prevent overlap dates in the calendar
        .value();
}


function occupancy(cal, duration_or_to, from) {
    from = (from) ? moment(from).utc : moment(cal.timestamp).utc();
    var to = getTo(from, duration_or_to);

    var days = getDays(cal, from, to);
    var occ = _.countBy(days, function(day){return day.type});

    _.forOwn(occ, function(value, key){
        occ[key + '_rate'] = Math.round(100*value/days.length)/100;
    });
    occ.total = days.length;

    return occ;
}

var DURATION_PATTERN = /(\d+)(\D$)/;    //i.e. 3M, 10d
function getTo(from, duration_or_to){
    duration_or_to = duration_or_to || '2M';
    var to;
    var durationParts = DURATION_PATTERN.exec(duration_or_to);
    if (durationParts) {
        to = moment(from).add(durationParts[1], durationParts[2]);
    } else{
        to = moment(duration_or_to);
    }
    return to;
}
module.exports.getDays = getDays;
module.exports.occupancy = occupancy;

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