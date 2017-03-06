var elasticsearch = require('elasticsearch');

var URIUtil = require("./../../utils/URIUtil");
var uriUtil = new URIUtil();

var client = elasticsearch.Client({
    hosts: [uriUtil.createElasticsearchUri(elasticsearchConfig)]
});

var elasticsearchConfig = {
    "host": "localhost",
    "port": 9200,
    "indices": {
        "index": "rapido",
        "type_locations": "locations"
    }
};

var elasticsearchIndexConfig = elasticsearchConfig.indices;
var INDEX = elasticsearchIndexConfig.index;
var TYPE_LOCATIONS = elasticsearchIndexConfig.type_locations;

function LocationSearch() {

}

LocationSearch.prototype.indexLocations = function (locations, callback) {
    var indexRequests = [];
    locations.forEach(function (location) {
        indexRequests.push({
            index: {
                _index: INDEX,
                _type: TYPE_LOCATIONS
            }
        });
        location.lastUpdated = new Date();
        indexRequests.push(location);
    }, this);
    client.bulk({
        body: indexRequests
    }, callback);
}

module.exports = LocationSearch;
