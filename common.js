var switchArray = function (e) {
    return Object.keys(e[0]).map(function (c) {
        return e.map(function (r) {
            return r[c];
        });
    });
};

module.exports = {switchArray};