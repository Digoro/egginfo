var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var config = require('../config')
const sequelize = new Sequelize(config.url, {autoIncrement: true});
var EggInfo = sequelize.define('egginfo', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: Sequelize.STRING,
        allowNull: true
    },
    city: {
        type: Sequelize.STRING,
        allowNull: true
    },
    farm: {
        type: Sequelize.STRING,
        allowNull: true
    },
    address: {
        type: Sequelize.STRING,
        allowNull: true
    },
    certification: {
        type: Sequelize.STRING,
        allowNull: true
    },
    test_agency: {
        type: Sequelize.STRING,
        allowNull: true
    },
    grabbed_sample_date: {
        type: Sequelize.STRING,
        allowNull: true
    },
    pesticide_name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    pesticide_amount: {
        type: Sequelize.STRING,
        allowNull: true
    },
    standard: {
        type: Sequelize.STRING,
        allowNull: true
    },
}, {
    timestamps: false,
    freezeTableName: true
});
var options = {
    url: 'http://www.mfds.go.kr/egg_detail.html',
    encoding: null
};
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var cheerioTableparser = require('cheerio-tableparser');
var request = require('request');
function transpose(a) {
    return Object.keys(a[0]).map(function (c) {
        return a.map(function (r) {
            return r[c];
        });
    });
}
router.get('/', function (req, res, next) {
    request(options, function (error, response, html) {
        if (error) throw error;
        var strContents = new Buffer(html);
        var converted = iconv.decode(strContents, 'EUC-KR').toString();
        var $ = cheerio.load(converted, {decodeEntities: false});
        cheerioTableparser($);
        var table = transpose($('table').parsetable());
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

        res.render('index', {egginfo: table});
    });
});

module.exports = router;
