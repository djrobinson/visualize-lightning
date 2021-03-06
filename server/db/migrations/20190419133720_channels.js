
exports.up = function(knex, Promise) {
    return knex.schema.createTable('channel_edges', function(table) {
        table.increments();
        table.string('channel_id').notNullable().unique();
        table.string('channel_point');
        table.string('last_update');
        table.string('node1_pub').notNullable();
        table.string('node2_pub').notNullable();
        table.string('capacity').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('channel_edges');
};
