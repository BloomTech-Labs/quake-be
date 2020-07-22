const db = require('../data/db-config');

function findActivity(tableName) {
    return db(tableName)
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

function checksum(tableName) {
    return db(tableName)
        .select('usgs_id')
        .orderBy('usgs_id', 'asc') // sort asc, important to compare checksums!
}

function delAllRecords(tableName) {
    return db(tableName).del()
}

function findGeometry(tableName,id) {
    return db(tableName)
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
    checksum,
};
