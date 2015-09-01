var elasticsearch = require('elasticsearch');
var CONFIG = require('config');
var moment = require('moment');
var logger = require('winston');

var batchDate = moment('2015-08-25');
var INDEX = 'bnb-' + batchDate.format('YYYY.MM.DD');

//var test = true;
//if (test) INDEX = 'test';
//if (test) SEARCH_Q += ' +term:Harajuku-Station--Tokyo--Japan +guests:2';

var es = new elasticsearch.Client({
    host: CONFIG.ELASTICSEARCH_HOST,
    log: 'info'
});

logger.info('enriching room for ' + INDEX + '...');

var allIds = [];
// first we do a search, and specify a scroll timeout
es.search({
    index: INDEX,
    // Set to 30 seconds because we are calling right back
    scroll: '30s',
    fields: ['id'],
    q: '+_type:room',
    size: 100
}, function getMoreUntilDone(error, response) {
    console.log(allIds.length + '/' + response.hits.total);
    // collect the title from each response
    response.hits.hits.forEach(function (hit) {
        //console.log(hit);
        allIds.push(hit.fields.id[0]);
    });

    if (response.hits.total !== allIds.length) {
        // now we can call scroll over and over
        es.scroll({
            scrollId: response._scroll_id,
            scroll: '30s'
        }, getMoreUntilDone);
    } else {
        console.log('every "test" title', allIds);
    }
});