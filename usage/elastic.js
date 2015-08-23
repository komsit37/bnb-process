var elasticsearch = require('elasticsearch');
var CONFIG = require('config');

var es = new elasticsearch.Client({
    host: CONFIG.ELASTICSEARCH_HOST,
    log: 'info'
});