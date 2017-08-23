var express = require('express');
var router = express.Router();
var async = require('async');
var EggInfo = require('../db');
var googleMapClient = require('@google/maps').createClient({
    key: 'AIzaSyCGcULOIoWgRqbW8Zz55GUNwJUmXiSONFY'
});

router.get('/eggInfoList', function (req, res, next) {
    EggInfo.findAll().then(function (eggInfo) {
        res.json(eggInfo.map(function (v) {
            var data = v.dataValues;
            var address = `${data.city} ${data.address} ${data.farm}`;
            return address
        }));
    })
});

function geocode(v, callback) {
    googleMapClient.geocode({address: v.dataValues.address}, function (err, data) {
        callback(null, data)
    });
}

router.get('/geocode', function (req, res, next) {
    EggInfo.findAll().then(function (eggInfo) {
        async.map(eggInfo, geocode, function (err, result) {
            res.json(result)
        })
    });
});

module.exports = router;
