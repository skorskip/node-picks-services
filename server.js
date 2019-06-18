var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config.json');
var cors = require('cors');
var app = express();
var port = process.env.PORT || 3000;

const mysql = require('mysql');
// connection configurations
const mc = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name
});

// connect to database
mc.connect();

app.use(cors());
app.listen(port);

console.log('API server started on: ' + port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./app/routes/routes'); //importing route
routes(app); //register the route