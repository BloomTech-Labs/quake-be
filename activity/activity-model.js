const db = require('../data/db-config');

function findActivity() {
    return db('activity')
        // .join("geometry", "geometry.usgs_id", "activity.usgs_id")
        .select("*")
};

function getById(id) {
    return db('activity')
      .where({ id })
      .first();
  }

function countRecords(tableName) {
    return db(tableName).count('usgs_id').first()
}

function delAllRecords(tableName) {
    return db(tableName).del()
}

function findGeometry(id) {
    return db("geometry as g")
    .where("usgs_id", id)
};

function addActivity(activityData, tableName) {
    return db(tableName)
    .insert(activityData)
    .then(ids => {
      return getById(ids[0]);
    });
}

function addGeometry(geometryData, tableName){
    return db(tableName)
    .insert(geometryData)
    .then(ids=>{
        return getById(ids[0]);
    });
}

module.exports = {
    findActivity,
    findGeometry,
    addActivity,
    addGeometry,
    countRecords,
    delAllRecords,
};
