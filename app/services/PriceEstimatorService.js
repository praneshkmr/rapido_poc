var config = require('config');

var GoogleMapsService = require("./GoogleMapsService");
var googleMapsService = new GoogleMapsService();

var priceConfig = config.get('price');

var BASE_FARE = priceConfig.baseFare;
var PER_KM_CHARGE = priceConfig.perKm;
var PER_MIN_CHARGE = priceConfig.perMin;

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