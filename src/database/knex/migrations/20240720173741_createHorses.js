exports.up = knex => knex.schema.createTable("horses", table => {
    table.increments("id");

    table
        .enum("state", ["active", "inative"], { useNative: true, enumName: "states" })
        .notNullable()
        .defaultTo("active");

    table.text("picture");
    table.text("surname").notNullable();

    table.text("name").notNullable();
    table
        .enum("gender", ["castrated", "stallion", "mare"], { useNative: true, enumName: "genders" })
        .notNullable()
        .defaultTo("castrated");

    table.text("record");
    table.timestamp("born").notNullable();

    table.text("owner");
    table
        .enum("march", ["beat", "shredded"], { useNative: true, enumName: "marchs" })
        .notNullable()
        .defaultTo("beat");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("horses");