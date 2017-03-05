var PriceEstimatorService = require('./app/services/PriceEstimatorService');
var priceEstimatorService = new PriceEstimatorService();

var data = {
    point1: {
        lat: 13.011134,
        lng: 77.659195
    },
    point2: {
        lat: 13.197935,
        lng: 77.703546
    }
}

priceEstimatorService.estimatePrice(data, function (err, result) {
    if (err) {
        console.log(err)
    }
    else {
        console.log(result);
    }
});