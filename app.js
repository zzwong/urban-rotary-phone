var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

// Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/privacy', function(req, res){
  res.sendfile('privacypolicy.htm');
});

app.get('/ping', function(req, res){
  res.send('pong');
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

// Verifies token
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'lit-fam') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})

// Lolz
var stuffs = ["its lit", "yee", "shiet mang", "lit fam", "freshhh", "swag", "what's good fam"];

// Does stuff
app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
      // sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
      sendTextMessage(sender, stuffs[Math.floor((Math.random()*6))]);
      console.log(text);
    }
  }
  res.sendStatus(200);
});


var token = "EAAW5YdCSTggBAMOC7hiqsbY3FctCowT5axK5mCqq7hY3mOxgxzBnLufOqyBdmKIr8wiJDayDutJEhgz8wlk1L25CNDpgFy60rQh0XxC8Pgt4NijpB54kVvZAByZAd1eNOjjQ6TvDYUnp0OxkiyN1na3BftJZCys9rcfmoYeSQZDZD";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}


app.listen(process.env.PORT || 3000)
