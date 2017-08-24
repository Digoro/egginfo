var express = require('express');
var router = express.Router();
var async = require('async');
var EggInfo = require('../db');
var googleMapKey = require('../config').googleMapKey;
var googleMapClient = require('@google/maps').createClient(googleMapKey);
var dbUrl = process.env['CLEARDB_DATABASE_URL'];
if (!dbUrl) dbUrl = require('../config').dbUrl.url;
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var cheerioTableParser = require('cheerio-tableparser');
var request = require('request');
var Sequelize = require('sequelize');
const sequelize = new Sequelize(dbUrl, {autoIncrement: true});

router.get('/eggInfoList', function (req, res, next) {
    EggInfo.findAll().then(function (eggInfo) {
        res.json(eggInfo.map(function (v) {
            return v.dataValues;
        }))
    })
});

function decoder(html) {
    var strContents = new Buffer(html);
    var converted = iconv.decode(strContents, 'UTF-8').toString();
    return converted;
}

var site = require('../config').eggInfoSite.site;
function updateEggInfo() {
    request({url: site, encoding: null}, function (error, response, html) {
        if (error) throw error;
        let eggInfo = JSON.parse(decoder(html));
        EggInfo.destroy({where: {}}).then(function () {
            sequelize.query('ALTER TABLE egginfo AUTO_INCREMENT = 1').then(function () {
                eggInfo.forEach(function (v) {
                    googleMapClient.geocode({address: v.address}, function (err, data) {
                        EggInfo.create({
                            code: v.nagak_cd.split("<br>").join(','),
                            city: v.sido_nm,
                            farm: v.nongga_nm,
                            address: v.address,
                            certification: v.certify_info,
                            test_agency: v.instt_nm,
                            grabbed_sample_date: v.sample_date,
                            pesticide_name: v.detect_pesti,
                            pesticide_amount: v.detect_amt,
                            standard: v.standard,
                            product_amount: v.product_amt,
                            breeding_size: v.sayuk_size,
                            location: JSON.stringify(data.json.results[0].geometry.location)
                        })
                    });
                });
            })
        });
    });
};

router.get('/updateEggInfo', function (req, res, next) {
    updateEggInfo()
});

module.exports = router;
