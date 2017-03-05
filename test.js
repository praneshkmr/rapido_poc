var PriceEstimatorService = require('./app/services/PriceEstimatorService');
var priceEstimatorService = new PriceEstimatorService();

var data = {
    point1: {
        lat: 10.995486,
        lng: 76.961382
    },
    point2: {
        lat: 11.039558,
        lng: 77.039816
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