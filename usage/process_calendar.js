var elasticsearch = require('elasticsearch');
var CONFIG = require('config');
var moment = require('moment');
var logger = require('winston');

var jsonfile = require('jsonfile');

var batchDate = moment('2015-09-04');
var INDEX = 'bnb-' + batchDate.format('YYYY.MM.DD');

//var test = true;
//if (test) INDEX = 'test';
//if (test) SEARCH_Q += ' +term:Harajuku-Station--Tokyo--Japan +guests:2';

var es = new elasticsearch.Client({
    host: CONFIG.ELASTICSEARCH_HOST,
    log: 'info'
});

logger.info('processing calendar for ' + INDEX + '...');

// first we do a search, and specify a scroll timeout
es.get({
    index: INDEX,
    type: 'calendar',
    id: '3266217'
}).then(function (response) {
    console.log(response);
    jsonfile.writeFile('calendar_sample.json', response._source);
    //es.index({index: 'test', type: 'room', id: response._id, body: response._source}).then(console.log);
});