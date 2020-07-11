const db = require('../data/db-config');

function findActivity() {
    return db('activity')
        // .join("geometry", "geometry.usgs_id", "activity.usgs_id")
        .select("*")
};

function findGeometry(id) {
    return db("geometry as g")
    .where("usgs_id", id)
};

module.exports = {
    findActivity,
    findGeometry,
};
