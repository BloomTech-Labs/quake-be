
exports.up = function(knex, Promise) {
    return knex.schema
    .createTable("activity", activity=> {
        activity.increments();
        activity.string("usgs_id")
        activity.decimal("mag");
        activity.string("place");
        activity.bigInteger("time");
        activity.bigInteger("updated");
        activity.integer("tz");
        activity.string("url");
        activity.string("detail");
        activity.integer("felt");
        activity.decimal("cdi");
        activity.decimal("mmi");
        activity.string("alert");
        activity.string("status");
        activity.integer("tsunami");
        activity.integer("sig");
        activity.string("net");
        activity.string("code");
        activity.string("ids");
        activity.string("sources");
        activity.string("types");
        activity.integer("nst");
        activity.decimal("dmin");
        activity.decimal("rms");
        activity.decimal("gap");
        activity.string("magType");
        activity.string("type");
        activity.string("title");
    })

    .createTable("geometry", geometry=>{
        geometry.increments();
        geometry.string("type");
        geometry.string("coordinates");
        geometry.string("usgs_id")
            .notNullable()
            .references('usgs_id').inTable('activity');
    })
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("activity")
        .dropTableIfExists("geometry")
};
