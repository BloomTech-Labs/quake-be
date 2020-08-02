exports.seed = function(knex) {
    return knex('geometry_tsunami').insert([
    {
        "type": "Point",
        "coordinates": `[
            142.373,
            38.297,
            29
        ]`,
        "usgs_id": "official20110311054624120_30"
        },
        {
            "type": "Point",
            "coordinates": `[
                142.373,
                38.297,
                29
            ]`,
            "usgs_id": "official20110311054624120_31"
            },
    ]);
};
