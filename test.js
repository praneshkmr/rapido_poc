// var PriceEstimatorService = require('./app/services/PriceEstimatorService');
// var priceEstimatorService = new PriceEstimatorService();

// var data = {
//     point1: {
//         lat: 13.011134,
//         lon: 77.659195
//     },
//     point2: {
//         lat: 13.197935,
//         lon: 77.703546
//     }
// }

// priceEstimatorService.estimatePrice(data, function (err, result) {
//     if (err) {
//         console.log(err)
//     }
//     else {
//         console.log(result);
//     }
// });

// var RandommLocationGenerator = require('./app/utils/RandomLocationGenerator');
// var data = {
//     count: 100,
//     type: "customer",
//     topLeft: {
//         lat: 13.011134,
//         lon: 77.659195
//     },
//     bottomRight: {
//         lat: 13.197935,
//         lon: 77.703546
//     }
// }
// RandommLocationGenerator.generateRandomLocations(data, function (err, result) {
//     console.log(result);
// });

var LocationService = require('./app/services/LocationService');
var locationService = new LocationService();
locationService.setRandomLocations(function(){});