
exports.up = function(knex, Promise) {
    return knex.schema.table('lightning_nodes', function(t) {
        t.dropColumn('latitude');
        t.dropColumn('longitude');
        t.dropColumn('network');
        t.string('color');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('lightning_nodes', function(t) {
        t.float('latitude');
        t.float('longitude');
        t.string('network');
        t.dropColumn('color');
    });
};