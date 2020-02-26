var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config.json');
var cors = require('cors');
var app = express();
var port = 3100;

app.use(cors());
app.listen(port);

console.log('API server started on: ' + port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./app/routes/routes'); //importing route
routes(app); //register the route