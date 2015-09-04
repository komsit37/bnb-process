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
    log: 'debug'
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
    var ids = _.pluck(hits.hits, '_id');
    console.log('ids are:', ids);
});

