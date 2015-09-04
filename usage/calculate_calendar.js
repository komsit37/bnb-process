var elasticsearch = require('elasticsearch');
var CONFIG = require('config');
var moment = require('moment');
var logger = require('winston');
var cu = require('./../lib/cal-utils');
var _ = require('lodash');
var batchDate = moment('2015-09-04');
var INDEX = 'bnb-' + batchDate.format('YYYY.MM.DD');


var test = false;
if (test) INDEX = 'test';
//if (test) SEARCH_Q += ' +term:Harajuku-Station--Tokyo--Japan +guests:2';

var es = new elasticsearch.Client({
    host: CONFIG.ELASTICSEARCH_HOST,
    log: 'info'
});

logger.info('searching room for ' + INDEX + '...');

es.search({
    index: INDEX,
    q: '_type:room',
    _source: false,
    size: 5000
}, function (error, response) {
    var hits = response.hits;
    logger.info('found', hits.total, 'hits');
    ids = _.pluck(hits.hits, '_id');
    //console.log('ids are:', ids);
    //console.log('first one', ids[0]);
    schedule_reindex(ids);
});

var counter = 0;
var ids = [];
function schedule_reindex() {
    if (counter < ids.length) {
        //console.log(counter, ids[counter]);
        reindex(ids[counter]);
        counter++;
        setTimeout(schedule_reindex, 50);
    } else{
        //console.log('last one', ids[ids.length - 1])
        console.log('done');
    }
}


function reindex(id) {
    es.mget({
        body: {
            docs: [
                {_index: INDEX, _type: 'room', _id: id},
                {_index: INDEX, _type: 'calendar', _id: id}
            ]
        }
    }, function (err, response) {
        if (err) {
            console.error(err);
            return;
        }
        //console.log(response.docs);
        var roomDoc = response.docs[0];
        var calDoc = response.docs[1];
        roomDoc._source.calculated = {calendar: cu.all(calDoc._source)};
        //console.log(roomDoc._source.calculated);
        es.index({index: INDEX, type: 'room', id: roomDoc._id, body: roomDoc._source}).then(console.log(counter + '/' + ids.length));
    });
}

