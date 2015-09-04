var bnb = require('bnb-lib');
var c = require('./../lib/cal-utils');

bnb.getCalendar('3266217').then(function(json){
    console.log(json);
    var all = c.all(json);
    console.log(all);
}).catch(function(err){
    console.log(err);
});