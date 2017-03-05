var GoogleMapsService = require("./GoogleMapsService");
var googleMapsService = new GoogleMapsService();

var BASE_FARE = 15;
var PER_KM_CHARGE = 5;
var PER_MIN_CHARGE = 1;

function PriceEstimatorService() {

}

PriceEstimatorService.prototype.estimatePrice = function (data, callback) {
    googleMapsService.calculateDistAndTime(data, function (err, result) {
        if (err) {
            callback(err);
        }
        else {
            var priceEstimate = BASE_FARE
                + PER_KM_CHARGE * result.distance.value / 1000
                + PER_MIN_CHARGE * result.duration.value / 60;
            callback(null, { priceEstimate: priceEstimate.toFixed(2) });
        }
    });
}

module.exports = PriceEstimatorService;