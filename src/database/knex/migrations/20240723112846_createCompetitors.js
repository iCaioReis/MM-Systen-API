exports.up = knex => knex.schema.createTable("competitors", table => {
    table.increments("id");

    table
        .enum("state", ["active", "inative"], { useNative: true, enumName: "states" })
        .notNullable()
        .defaultTo("active");

    table.text("picture");
    table.text("surname").notNullable();

    table.text("name").notNullable();
    table
        .enum("gender", ["male", "female"], { useNative: true, enumName: "genders" })
        .notNullable()
        .defaultTo("male");

    table.text("CPF").notNullable();
    table.timestamp("born").notNullable();
    table
        .enum("category", ["kids", "little", "juvenile", "beginner", "female", "adult", "master", "open"], { useNative: true, enumName: "categorys" })
        .notNullable()
        .defaultTo("kids");
    table.timestamp("category_date").notNullable();

    table.text("phone");
    table.text("email");

    table.text("address");
    table.text("address_number");
    table.text("address_neighborhood");
    table.text("address_city");
    table.text("address_uf");
    table.text("address_country");

    table.text("pix");
    table.text("favored");

    table.text("bank");
    table.text("agency");
    table.text("account");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("competitors");