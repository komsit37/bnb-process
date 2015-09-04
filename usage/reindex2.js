var elasticsearch = require('elasticsearch');
var CONFIG = require('config');
var moment = require('moment');
var logger = require('winston');
var cu = require('./../lib/cal-utils');

var batchDate = moment('2015-09-04');
var FROM_INDEX = 'bnb-' + batchDate.format('YYYY.MM.DD');

var test = true;
if (test) TO_INDEX = 'test';
//if (test) SEARCH_Q += ' +term:Harajuku-Station--Tokyo--Japan +guests:2';

var es = new elasticsearch.Client({
    host: CONFIG.ELASTICSEARCH_HOST,
    log: 'debug'
});

logger.info('reindexing room from ' + FROM_INDEX + ' to ' + TO_INDEX);

var allIds = [];
// first we do a search, and specify a scroll timeout
es.mget({
    body: {
        docs: [
            {_index: FROM_INDEX, _type: 'room', _id: '3266217'},
            {_index: FROM_INDEX, _type: 'calendar', _id: '3266217'}
        ]
    }
}, function (err, response) {
    if (err) {
        console.error(err);
    }
    //console.log(response.docs);
    var roomDoc = response.docs[0];
    var calDoc = response.docs[1];
    roomDoc._source.calculated = {calendar: cu.all(calDoc._source)};
    console.log(roomDoc._source.calculated);
    es.index({index: TO_INDEX, type: 'room', id: roomDoc._id, body: roomDoc._source}).then(console.log);
});


