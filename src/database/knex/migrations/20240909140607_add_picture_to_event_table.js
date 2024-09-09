exports.up = knex => knex.schema.alterTable("events", table => {
    table.boolean("picture");
});

exports.down = knex => knex.schema.alterTable("events", table => {
    table.dropColumn("picture");
});
