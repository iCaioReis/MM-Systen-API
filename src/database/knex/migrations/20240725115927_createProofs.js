exports.up = knex => knex.schema.createTable("proofs", table => {
    table.increments("id");

    table
        .enum("state", ["active", "making_registrations", "finished_inscriptions", "running", "finished", "inative"], { useNative: true, enumName: "states" })
        .notNullable()
        .defaultTo("active");

    table
        .enum("name", ["seis_balizas", "tres_tambores", "maneabilidade"], { useNative: true, enumName: "names" })
        .notNullable();

    table.integer("event_id").references("id").inTable("events");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("proofs");