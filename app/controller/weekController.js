'use strict';

var Week = require('../model/weekModel.js');

exports.getCurrentWeek = function(res) {
    Week.getCurrentWeek(function(err, week) {
        if (err) res.send(err);
        res.json(week);
    });
};

exports.getWeek = function(req, res) {
    Week.getWeek(req.params.season, req.params.week, function(err, week) {
        if(err) res.send(err);
        res.json(week);
    });
};