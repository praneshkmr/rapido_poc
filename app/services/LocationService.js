var async = require('async');

var RandomLocationGenerator = require('./../utils/RandomLocationGenerator');

var LocationSearch = require('./../dao/elasticsearch/LocationSearch');
var locationSearch = new LocationSearch();

var BOUNDARY = {
    topLeft: {
        lat: 13.011134,
        lon: 77.659195
    },
    bottomRight: {
        lat: 13.197935,
        lon: 77.703546
    }
}

function LocationService() {

}

LocationService.prototype.setRandomLocations = function (callback) {
    var locations = [];
    async.waterfall([
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

LocationService.prototype.buildBoundary = function (callback) {
    locationSearch.buildBoundary(function (err, result) {
        if (err) {
            callback(err);
        }
        else {
            transformBoundaryResult(result, callback);
        }
    });
}

function transformBoundaryResult(result, callback) {
    var buckets = result.aggregations.bangaloreClusters.buckets;
    var clusters = []
    buckets.forEach(function (bucket) {
        var cluster = {
            geoHash: bucket.key,
            totalCount: bucket.doc_count,
            count: {
                drivers: null,
                customers: null
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