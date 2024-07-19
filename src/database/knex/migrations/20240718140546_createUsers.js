exports.up = knex => knex.schema.createTable("users", table => {
    table.increments("id");

    table
        .enum("state", ["active", "inative"], { useNative: true, enumName: "states" })
        .notNullable()
        .defaultTo("active");

    table.text("picture");

    table.text("login").notNullable();
    table.text("password").notNullable();

    table
        .enum("privilege", ["common", "administrator", "judge", "sup"], { useNative: true, enumName: "privileges" })
        .notNullable()
        .defaultTo("common");

    table.text("name").notNullable();
    table.text("phone").notNullable();

    table
        .enum("gender", ["male", "female"], { useNative: true, enumName: "genders" })
        .notNullable()
        .defaultTo("male");

    table.text("CPF");
    table.timestamp("born");
    table.text("email");

    table.text("pix");
    table.text("favored");

    table.text("bank");
    table.text("agency");
    table.text("account");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("users");