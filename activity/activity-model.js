const db = require('../data/db-config');

function findActivity() {
    return db('activity')
        .join("geometry", "geometry.usgs_id", "activity.usgs_id")
        .select("*")
};

module.exports = {
    findActivity,
};
