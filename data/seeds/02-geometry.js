exports.seed = function(knex) {
    return knex('geometry').insert([
        {
            "type":"Point", 
            "coordinates": `[
                -116.8003333,
                33.4768333,
                6.84
            ]`,
            "usgs_id": "ci39492872"
        },
        {
            "type":"Point", 
            "coordinates": `[
                -116.8003333,
                33.4768333,
                6.84
            ]`,
            "usgs_id": "ci39492864"
        }
    ]);
};