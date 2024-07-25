exports.up = knex => knex.schema.createTable("fouls", table => {
    table.increments("id");

    table.text("foul");
    table.text("addition");
    table.text("amount");

    table.integer("competitor-horse-categorie_id").references("id").inTable("competitor-horse-categorie");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("fouls");