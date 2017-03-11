var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var location = require('./app/dao/elasticsearch/init');


var location = require('./app/routes/Location');
var price = require('./app/routes/Price');

app.use('/location', location);
app.use('/price', price);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send(err);
});

//Starting the Web Server
app.set('port', process.env.PORT || 3000);

/**
 * Listen on provided port, on all network interfaces.
 */

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

app.on('error', onError);
app.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

var LocationService = require('./app/services/LocationService');
var locationService = new LocationService();

//WebSockets
var WebSocket = require('ws');
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

app.set('wss',wss);


module.exports = app;
