
exports.up = function(knex, Promise) {
    return knex.schema.table('lightning_nodes', function(t) {
        t.dropColumn('latitude');
        t.dropColumn('longitude');
        t.dropColumn('network');
        t.string('color');
        t.foreign('ip_address').references('ip').inTable('ip_geo_lookup')
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('lightning_nodes', function(t) {
        t.dropForeign('ip_address');
        t.float('latitude');
        t.float('longitude');
        t.string('network');
        t.dropColumn('color');
    });
};