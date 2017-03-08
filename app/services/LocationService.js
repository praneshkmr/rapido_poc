var async = require('async');
var config = require('config');

var RandomLocationGenerator = require('./../utils/RandomLocationGenerator');

var LocationSearch = require('./../dao/elasticsearch/LocationSearch');
var locationSearch = new LocationSearch();

var SurgeFactorUtil = require('./../utils/SurgeFactorUtil');

var boundaryConfig = config.get('boundary');

var BOUNDARY = boundaryConfig.bangalore;

function LocationService() {

}

LocationService.prototype.setRandomLocations = function (callback) {
    var locations = [];
    async.waterfall([
        function (cb) {
            locationSearch.deleteLocations(function (err, result) {
                if (err) {
                    console.log(err);
                    cb(err);
                }
                else {
                    cb();
                }
            })
        },
        function (cb) {
            var data = {
                count: 300,
                type: "customer"
            }
            data.topLeft = BOUNDARY.topLeft;
            data.bottomRight = BOUNDARY.bottomRight;
            RandomLocationGenerator.generateRandomLocations(data, function (err, result) {
                if (err) {
                    cb(err);
                }
                else {
                    locations = locations.concat(result);
                    cb();
                }
            });
        },
        function (cb) {
            var data = {
                count: 100,
                type: "driver"
            }
            data.topLeft = BOUNDARY.topLeft;
            data.bottomRight = BOUNDARY.bottomRight;
            RandomLocationGenerator.generateRandomLocations(data, function (err, result) {
                if (err) {
                    cb(err);
                }
                else {
                    locations = locations.concat(result);
                    cb();
                }
            });
        },
        function (cb) {
            console.log(locations);
            locationSearch.indexLocations(locations, function (err, result) {
                if (err) {
                    console.log(err);
                    cb(err);
                }
                else {
                    cb(null, result);
                }
            })
        }
    ], function (err, result) {
        console.log(result);
        callback(err, result);
    });
}

LocationService.prototype.createClusters = function (callback) {
    locationSearch.createClusters(function (err, result) {
        if (err) {
            callback(err);
        }
        else {
            transformCreateClustersResult(result, function (err, result) {
                if (err) {
                    callback(err);
                }
                else {
                    SurgeFactorUtil.calculateSurgeFactorPerCluster(result);
                    callback(null, result);
                }
            });
        }
    });
}

LocationService.prototype.getAllLocations = function (callback) {
    locationSearch.getAllLocations(function (err, result) {
        if (err) {
            callback(err);
        }
        else {
            transformGetAllLocationResult(result, callback);
        }
    });
}

function transformGetAllLocationResult(result, callback) {
    var locationDocs = result.hits.hits;
    var locations = [];
    locationDocs.forEach(function (doc) {
        var location = doc._source;
        locations.push(location);
    }, this);
    callback(null, locations);
}

function transformCreateClustersResult(result, callback) {
    var buckets = result.aggregations.bangaloreClusters.buckets;
    var clusters = []
    buckets.forEach(function (bucket) {
        var cluster = {
            geoHash: bucket.key,
            totalCount: bucket.doc_count,
            count: {
                drivers: 0,
                customers: 0
            }
        }
        bucket.types.buckets.forEach(function (type) {
            if (type.key === "customer") {
                cluster.count.customers = type.doc_count;
            }
            else if (type.key === "driver") {
                cluster.count.drivers = type.doc_count;
            }
        }, this);
        clusters.push(cluster);
    }, this);
    callback(null, clusters);
}

module.exports = LocationService;