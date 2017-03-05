var GoogleMapsService = require("./GoogleMapsService");
var googleMapsService = new GoogleMapsService();

var BASE_FARE = 15;
var PER_KM_CHARGE = 5;
var PER_MIN_CHARGE = 1;

function PriceEstimatorService() {

}

PriceEstimatorService.prototype.estimatePrice = function (data, callback) {
    googleMapsService.calculateDistAndTime(data, function (err, distAndTime) {
        if (err) {
            callback(err);
        }
        else {
            var priceEstimate = BASE_FARE
                + PER_KM_CHARGE * (distAndTime.distance.value / 1000).toFixed(2)
                + PER_MIN_CHARGE * (distAndTime.duration.value / 60).toFixed(2);
            callback(null, { priceEstimate: priceEstimate.toFixed(2), metrics: distAndTime });
        }
    });
}

module.exports = PriceEstimatorService;