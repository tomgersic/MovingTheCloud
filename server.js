var util            = require('util'),
    https           = require('https'),
    express         = require('express'),
    app             = express.createServer(),
    io              = require('socket.io').listen(app),
    WebSocketServer = require('ws').Server,
    WebSocket       = require('ws'),
    base64          = require('./lib/base64'),
    Twitter         = require('ntwitter');

//set up express server
var port = process.env.PORT || 8888;
app.listen(port);

app.configure(function () {
    app.use(express.static(__dirname + '/'));
});

const KEYWORD  = "cloud,forcedotcom,modelmetricsinc,salesforce,model%20metrics,aws,force.com,mobile,amazon%20web%20services,chatter,html5,social,dreamforce,df12";

//Set up ntwitter...
//Get your own keys over at dev.twitter.com

var twit = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

twit.verifyCredentials(function (err, data) {
    if (err) {
      log("Error verifying credentials: " + err);
      process.exit(1);
    }
  });

//hold HTTP clients
var clients = [];

twit.stream('statuses/filter',  {'track':KEYWORD}, function(stream) {
  stream.on('data', function (data) {
    //log(data.text+'\n\n');
    var tweet = strencode(censorTweet(data.text));
    // Send response to all connected clients
    clients.forEach(function(client) {
      client.emit('tweet',tweet);
    });
  });
  stream.on('end', function (response) {
       // Handle a disconnection
       killTwitterStream();
  });
  stream.on('destroy', function (response) {
       // Handle a 'silent' disconnection from Twitter, no end/error event fired
       killTwitterStream();
  });
});

io.sockets.on('connection', function (client) {
  clients.push(client);
  log('Client Connected. Memory usage is: '+util.inspect(process.memoryUsage()));
  client.on('disconnect',function() {
    log('Client Disconnected. Memory usage is: '+util.inspect(process.memoryUsage()));
    clients.splice(clients.indexOf(client), 1);
  });
});

/**
 * Something borked. Kill twitter stream.
 **/
function killTwitterStream() { 
  log("Killing Process")
  process.exit(1);
}


/**
 * Simple log...
 **/
function log(logText) {
  console.log(new Date().toDateString()+ ": "+logText);
}

/**
 * Censor some dirty words...
 **/
function censorTweet(tweetText) {
  tweetText = tweetText.replace(/fuck/gi,'****');
  tweetText = tweetText.replace(/shit/gi,'****');
  return tweetText;
}

function strencode( data ) {
  return unescape( encodeURIComponent( JSON.stringify( data ) ) );
}