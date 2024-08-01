exports.up = knex => knex.schema.createTable("fouls", table => {
    table.increments("id");

    table
        .enum("name", ["foul", "SAT", "NPC"], { useNative: true, enumName: "names" })
        .notNullable();

    table.text("amount").notNullable();
    table.text("observation");

    table.integer("register_id").references("id").inTable("competitor-horse-categorie").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("fouls");