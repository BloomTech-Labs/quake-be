
exports.up = function(knex) {
    return knex.schema.createTable("activity", function(actions) {
        activity.increments();
        activity.string("usgs_id").notNullable();
        activity.decimal("longitude");
        activity.decimal("latitude");
        activity.decimal("depth");
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
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("activity");
};
