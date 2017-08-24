var dbUrl = process.env['DATABASE_URL'];
var Sequelize = require('sequelize');
const sequelize = new Sequelize(dbUrl, {autoIncrement: true});
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
    product_amount: {
        type: Sequelize.STRING,
        allowNull: true
    },
    breeding_size: {
        type: Sequelize.STRING,
        allowNull: true
    },
    location: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = EggInfo;