
exports.up = function(knex, Promise) {
    return knex.schema.createTable('lightning_nodes', function(table) {
        table.increments();
        table.string('public_key').notNullable().unique();
        table.string('ip_address').notNullable();
        table.string('network').notNullable();
        table.string('alias').notNullable();
        table.string('latitude');
        table.integer('longitude');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('lightning_nodes');
};
