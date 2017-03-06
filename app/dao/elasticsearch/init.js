var elasticsearch = require('elasticsearch');

var URIUtil = require("./../../utils/URIUtil");
var uriUtil = new URIUtil();

var elasticsearchConfig = {
    "host": "localhost",
    "port": 9200,
    "username": "",
    "password": "",
    "indices": {
        "index": "rapido",
        "type_locations": "locations"
    }
};

var elasticsearchIndexConfig = elasticsearchConfig.indices;
var INDEX = elasticsearchIndexConfig.index;
var TYPE_LOCATIONS = elasticsearchIndexConfig.type_locations;

var client = elasticsearch.Client({
    hosts: [uriUtil.createElasticsearchUri(elasticsearchConfig)]
});

function initIndexIfNotExists() {
    client.indices.exists({
        index: INDEX
    }).then(function (exists) {
        if (!exists) {
            client.indices.putMapping({
                index: INDEX,
                type: TYPE_LOCATIONS,
                body: {
                    "properties": {
                        "location": {
                            "type": "geo_point"
                        }
                    }
                }
            });
        }
    });
}

initIndexIfNotExists()
