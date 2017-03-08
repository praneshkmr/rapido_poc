var express = require('express');
var router = express.Router();

var LocationService = require('./../services/LocationService');
var locationService = new LocationService();

router.get('/all', function (req, res, next) {
    locationService.getAllLocations(function (err, result) {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        }
        else {
            res.send(result);
        }
    })
});

router.get('/clusters', function (req, res, next) {
    locationService.createClusters(function (err, result) {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        }
        else {
            res.send(result);
        }
    })
});

router.post('/random', function (req, res, next) {
    locationService.setRandomLocations(function (err, result) {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        }
        else {
            res.send(result);
        }
    })
});

module.exports = router;
