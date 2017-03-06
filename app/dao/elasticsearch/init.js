var config = require('config');
var elasticsearch = require('elasticsearch');

var URIUtil = require("./../../utils/URIUtil");
var uriUtil = new URIUtil();

var elasticsearchConfig = config.get('elasticsearch');
var elasticsearchIndexConfig = config.get('elasticsearch.indices');

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
            client.indices.create({
                index: INDEX
            }).then(function () {
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
            });
        }
    });
}

initIndexIfNotExists()
