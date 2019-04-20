
exports.up = function(knex, Promise) {
    return knex.schema.createTable('lightning_nodes', function(table) {
        table.increments();
        table.string('public_key').notNullable().unique();
        table.string('ip_address');
        table.string('network');
        table.string('alias');
        table.string('latitude');
        table.string('longitude');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('lightning_nodes');
};
