var elasticsearch = require('elasticsearch');
var CONFIG = require('config');

var logger = require('./../lib/init/logger');

var INDEX = 'bnb-2015.08.24';
var TYPE = 'ranking';
var SEARCH_Q = '+_type:search';
var SIZE = 100;

var test = false;
if (test) SEARCH_Q += ' +term:Harajuku-Station--Tokyo--Japan +guests:2';

var es = new elasticsearch.Client({
    host: CONFIG.ELASTICSEARCH_HOST,
    log: 'info'
});

es.search({
    index: INDEX,
    q: SEARCH_Q,
    size: SIZE
}).then(function(response){
    //console.log(response.hits.hits.map(function(d){return {name: d._source.name, id: d._source.id}}));
    var searchResults = response.hits.hits.map(function(d){return d._source});
    logger.info('found', searchResults.length, 'search results');

    var myId = '3266217';
    var idRankMap = {};
    for (i in searchResults){
        //console.log(res[i]);
        var result = searchResults[i];
        logger.info('getting ranks for', result.ids.length, 'ids');
        result.ids.forEach(function(id, ii){
            upsertRank(result, ii+1, idRankMap, id);
        })
    }
    if (test) logger.debug('my room:', idRankMap[myId]);
    var body = [];
    Object.keys(idRankMap).forEach(function(id){
        //console.log(id);
        var r = idRankMap[id];
        //console.log(r);
        body.push({index: {_index: INDEX, _type: TYPE, _id:r.id }});
        body.push(r);
    });
    if (body.length > 0) {
        logger.info('bulk indexing', body.length, 'ids');
        es.bulk({body: body}).then(logger.debug);
    }else
        logger.info('search returned empty results');
});

function upsertRank(result, i, idRankMap, id) {
    var rank = {term: result.term, guests: result.guests, rank: i};
    if (!idRankMap[id]) {
        //create new
        idRankMap[id] = {timestamp: new Date(), id: id, ranks: [rank]}
    } else {
        //update existing
        idRankMap[id].ranks.push(rank);
    }
}

//16 '3266217' 'Harajuku-Station--Tokyo--Japan'
//12 '3266217' 'Harajuku-Station--Tokyo--Japan'
//2630 '3266217' 'Tokyo'