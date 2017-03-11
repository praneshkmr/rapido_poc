var WebSocket = require('ws');

var LocationService = require('./../../app/services/LocationService');
var locationService = new LocationService();

function WebSocketListener(server) {
    this._server = server;
    initLiveLocationListener(this._server);
}

function initLiveLocationListener(server) {
    var wss = new WebSocket.Server({ server });

    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
            var data = JSON.parse(message);
            var location = {
                location: {
                    lat: data.lat,
                    lon: data.lon
                },
                type: data.type,
                id: data.id
            }
            if (data.id) {
                locationService.updateLocation(location, function (err, location) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        wss.broadcast(JSON.stringify({ "type": "broadcast", "data": { id: location._id, lat: data.lat, lon: data.lon } }));
                    }
                });
            }
            else {
                locationService.saveLocation([location], function (err, location) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        ws.send(JSON.stringify({ "type": "id", "data": location._id }));
                        wss.broadcast(JSON.stringify({ "type": "broadcast", "data": { id: location._id, lat: data.lat, lon: data.lon } }));
                    }
                });
            }
        });
    });

    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            client.send(data);
        });
    };
}

module.exports = WebSocketListener;