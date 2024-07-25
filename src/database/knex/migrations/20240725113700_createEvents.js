exports.up = knex => knex.schema.createTable("events", table => {
    table.increments("id");

    table
        .enum("state", ["active", "making_registrations", "finished_inscriptions", "running", "finished", "inative"], { useNative: true, enumName: "states" })
        .notNullable()
        .defaultTo("active");

    table.text("name").notNullable();
   
    table.timestamp("start_date").notNullable();
    table.timestamp("end_date").notNullable();
   
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("events");