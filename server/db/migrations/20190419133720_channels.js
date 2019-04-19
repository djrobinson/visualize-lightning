
exports.up = function(knex, Promise) {
    return knex.schema.createTable('channel_edges', function(table) {
        table.increments();
        table.string('channel_id').notNullable().unique();
        table.string('channel_point').notNullable();
        table.string('last_update').notNullable();
        table.string('node1_pub').notNullable();
        table.string('node2_pub').notNullable();
        table.integer('capacity').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('channel_edges');
};
