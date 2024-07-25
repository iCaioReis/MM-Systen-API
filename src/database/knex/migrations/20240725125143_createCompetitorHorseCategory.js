exports.up = knex => knex.schema.createTable("competitor-horse-categorie", table => {
    table.increments("id");

    table
        .enum("state", ["active", "running", "finished"], { useNative: true, enumName: "states" })
        .notNullable()
        .defaultTo("active");

    table.integer("competitor_order");

    table.text("time");

    table.integer("competitor_id").references("id").inTable("competitors");
    table.integer("horse_id").references("id").inTable("horses");
    table.integer("categorie_id").references("id").inTable("categories");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("competitor-horse-categorie");