var express = require('express');
var router = express.Router();

var PriceEstimatorService = require('./../services/PriceEstimatorService');
var priceEstimatorService = new PriceEstimatorService();

router.post('/estimate', function (req, res, next) {
    console.log(req.body);
    try {
        var data = {
            point1: {
                lat: req.body.point1_lat,
                lon: req.body.point1_lon
            },
            point2: {
                lat: req.body.point2_lat,
                lon: req.body.point2_lon
            }
        }
    }
    catch (e) {
        return res.status(500).send(err);
    }
    priceEstimatorService.estimatePrice(data, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            res.send(result);
        }
    })
});

module.exports = router;
