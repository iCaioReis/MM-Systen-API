exports.up = knex => knex.schema.createTable("categories", table => {
    table.increments("id");

    table
        .enum("state", ["active", "making_registrations", "finished_inscriptions", "running", "finished", "inative"], { useNative: true, enumName: "states" })
        .notNullable()
        .defaultTo("active");

    table.integer("last_competitor");

    table
        .enum("name", ["kids", "little", "juvenile", "beginner", "female", "adult", "master", "open"], { useNative: true, enumName: "names" })
        .notNullable();

    table.integer("proof_id").references("id").inTable("proofs");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("categories");