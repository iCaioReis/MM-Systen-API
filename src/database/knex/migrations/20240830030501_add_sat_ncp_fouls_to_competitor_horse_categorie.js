exports.up = knex => knex.schema.alterTable("competitor-horse-categorie", table => {
    table.boolean("SAT").defaultTo(false);  // Adiciona a coluna SAT como boolean
    table.boolean("NCP").defaultTo(false);  // Adiciona a coluna NCP como boolean
    table.integer("fouls").defaultTo(0);    // Adiciona a coluna fouls como integer
});

exports.down = knex => knex.schema.alterTable("competitor-horse-categorie", table => {
    table.dropColumn("SAT");   // Remove a coluna SAT
    table.dropColumn("NCP");   // Remove a coluna NCP
    table.dropColumn("fouls"); // Remove a coluna fouls
});
