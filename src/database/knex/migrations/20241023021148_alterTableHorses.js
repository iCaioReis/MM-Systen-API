exports.up = (knex) => knex.schema.table('horses', (table) => {
    table.string('chip').nullable();
});

exports.down = (knex) => knex.schema.table('horses', (table) => {
    table.dropColumn('chip');
});
