var config = require('config');
var elasticsearch = require('elasticsearch');

var URIUtil = require("./../../utils/URIUtil");
var uriUtil = new URIUtil();

var elasticsearchConfig = config.get('elasticsearch');
var elasticsearchIndexConfig = config.get('elasticsearch.indices');

var client = elasticsearch.Client({
    hosts: [uriUtil.createElasticsearchUri(elasticsearchConfig)]
});

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

LocationSearch.prototype.deleteLocations = function (callback) {
    client.search({
        index: INDEX,
        type: TYPE_LOCATIONS,
        size: 1000,
    }).then(function (resp) {
        var indexRequests = []
        resp.hits.hits.forEach(function (index) {
            indexRequests.push({ delete: { _index: INDEX, _type: TYPE_LOCATIONS, _id: index._id } });
        }, this);
        if (indexRequests.length > 0) {
            client.bulk({
                body: indexRequests
            }, callback);
        }
        else {
            callback();
        }
    }, function (err) {
        callback(err);
    });
}

LocationSearch.prototype.createClusters = function (callback) {
    client.search({
        index: INDEX,
        body: {
            "query": {
                "constant_score": {
                    "filter": {
                        "geo_bounding_box": {
                            "location": {
                                "top_left": {
                                    "lat": 13.169339,
                                    "lon": 77.428368
                                },
                                "bottom_right": {
                                    "lat": 12.720980,
                                    "lon": 77.876061
                                }
                            }
                        }
                    }
                }
            },
            "aggs": {
                "bangaloreClusters": {
                    "geohash_grid": {
                        "field": "location",
                        "precision": 5
                    },
                    "aggs": {
                        "types": {
                            "terms": { "field": "type" }
                        }
                    }
                }
            }
        }
    }).then(function (resp) {
        callback(null, resp);
    }, function (err) {
        callback(err);
    });
}

LocationSearch.prototype.getAllLocations = function (callback) {
    client.search({
        index: INDEX,
        type: TYPE_LOCATIONS,
        size: 1000,
        q: "*.*"
    }).then(function (resp) {
        callback(null, resp);
    }, function (err) {
        callback(err);
    });
}

module.exports = LocationSearch;
