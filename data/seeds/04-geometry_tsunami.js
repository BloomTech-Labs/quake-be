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
                -72.898,
                -36.122,
                22.9
            ]`,
            "usgs_id": "official20100227063411530_30"
        },
        {
            "type": "Point",
            "coordinates": `[
                95.982,
                3.295,
                30
            ]`,
            "usgs_id": "official20041226005853450_30"
        },
        {
            "type": "Point",
            "coordinates": `[
                -147.339,
                60.908,
                25
            ]`,
            "usgs_id": "official19640328033616_30"
        },
    ]);
};
