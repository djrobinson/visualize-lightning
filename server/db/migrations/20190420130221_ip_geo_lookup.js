
exports.up = function(knex, Promise) {
    return knex.schema.createTable('ip_geo_lookup', function(table) {
        table.string('ip').notNullable().unique().primary();
        table.string('type');
        table.string('continent_code');
        table.string('continent_name');
        table.string('country_code');
        table.string('country_name');
        table.string('region_code');
        table.string('region_name');
        table.string('city');
        table.string('zip');
        table.string('latitude');
        table.string('longitude');
        table.string('country_flag');
        table.string('country_flag_emoji');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('ip_geo_lookup');
};
