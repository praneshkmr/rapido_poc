var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCrDtWlV-qMgRE201xfCTZ9EyzzKbACkd0'
});

function GoogleMapsService() {

}

GoogleMapsService.prototype.calculateDistAndTime = function (data, callback) {
    var point1 = data.point1;
    var point2 = data.point2;
    googleMapsClient
        .distanceMatrix({
            origins: [
                point1.lat + ',' + point1.lon
            ],
            destinations: [
                point2.lat + ',' + point2.lon
            ]
        }, function (err, response) {
            if (err) {
                callback(err);
            }
            else {
                var result = response.json;
                if (result.status === 'OK') {
                    var firstElement = result.rows[0].elements[0];
                    if (firstElement.status === 'OK') {
                        callback(null, { distance: firstElement.distance, duration: firstElement.duration });
                    }
                    else {
                        callback(new Error("First Element Status Not OK"));
                    }
                }
                else {
                    callback(new Error("Response Status Not OK"));
                }
            }
        });
}

module.exports = GoogleMapsService;