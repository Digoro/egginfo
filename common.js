var switchArray = function (e) {
    return Object.keys(e[0]).map(function (c) {
        return e.map(function (r) {
            return r[c];
        });
    });
};
var dbconfig = process.env['CLEARDB_DATABASE_URL'];
if (!dbconfig) dbconfig = require('./config').url;
var EggInfo = require('./db');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var cheerioTableParser = require('cheerio-tableparser');
var request = require('request');
var Sequelize = require('sequelize');
const sequelize = new Sequelize(dbconfig, {autoIncrement: true});

var updateEggInfo = function () {
    request({url: 'http://www.mfds.go.kr/egg_detail.html', encoding: null}, function (error, response, html) {
        if (error) throw error;
        var strContents = new Buffer(html);
        var converted = iconv.decode(strContents, 'EUC-KR').toString();
        var $ = cheerio.load(converted, {decodeEntities: false});
        cheerioTableParser($);
        var table = switchArray($('table').parsetable());
        EggInfo.destroy({where: {}}).then(function () {
            sequelize.query('ALTER TABLE egginfo AUTO_INCREMENT = 1').then(function () {
                table.forEach(function (v, i) {
                    if (i != 0) {
                        EggInfo.create({
                            code: v[1],
                            city: v[2],
                            farm: v[3],
                            address: v[4],
                            certification: v[5],
                            test_agency: v[6],
                            grabbed_sample_date: v[7],
                            pesticide_name: v[8],
                            pesticide_amount: v[9],
                            standard: v[10],
                        })
                    }
                });
            })
        });
    });
};

module.exports = {switchArray, updateEggInfo};