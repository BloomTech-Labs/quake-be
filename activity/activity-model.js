const db = require('../data/db-config');

function findActivity() {
    return db('activity');
}

module.exports = {
    findActivity,
};
