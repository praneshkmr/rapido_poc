var FIXED = 3;

function RandomLocationGenerator() {

}

RandomLocationGenerator.generateRandomLocations = function (data, callback) {
    var count = data.count;
    var topLeft = data.topLeft;
    var bottomRight = data.bottomRight;
    var type = data.type;
    var randomLocations = [];
    for (var i = 0; i < count; i++) {
        var randomLocation = getRandomLocation(topLeft, bottomRight);
        randomLocation.type = type;
        randomLocations.push(randomLocation);
    }
    callback(null, randomLocations);
}

function getRandomLocation(topLeft, bottomRight) {
    var topLeftLat = topLeft.lat;
    var topLeftLon = topLeft.lon;
    var bottomRightLat = bottomRight.lat;
    var bottomRightLon = bottomRight.lon;
    var randomLocation = {
        lat: getRandomInRange(topLeftLat, bottomRightLat, FIXED),
        lon: getRandomInRange(topLeftLon, bottomRightLon, FIXED)
    }
    return randomLocation;
}

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}

module.exports = RandomLocationGenerator;