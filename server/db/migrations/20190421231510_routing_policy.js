
exports.up = function(knex, Promise) {
    return knex.schema.createTable('routing_policies', function(table) {
        table.string('policy_id').unique().primary();
        table.string('policy_owner_public_key');
        table.string('policy_channel_id');
        table.integer('time_lock_delta');
        table.string('min_htlc');
        table.string('fee_base_msat');
        table.string('fee_rate_milli_msat');
        table.string('disabled');
        table.string('max_htlc_msat');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('routing_policies');
};
