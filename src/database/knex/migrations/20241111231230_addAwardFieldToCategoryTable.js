exports.up = (knex) => knex.schema.table('categories', (table) => {
    table.string('first_place_award').nullable();
    table.string('second_place_award').nullable();
    table.string('third_place_award').nullable();
});

exports.down = (knex) => knex.schema.table('categories', (table) => {
    table.dropColumn('first_place_award');
    table.dropColumn('second_place_award');
    table.dropColumn('third_place_award');
});