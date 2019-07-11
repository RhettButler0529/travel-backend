require("dotenv").config();

// Postgres imports
// const pg = require("pg");
// pg.defaults.ssl = true;

// Production database connection
const dbConnection = process.env.DATABASE_URL;
const tables = {
  dev: 'roamlydev',
  test: 'test',
};

// Postgres configurations
// Command for running postgres locally:
// knex migrate:latest --env production
// knex seed:run --env production

module.exports = {
  development: {
    client: "pg",
    connection: `${dbConnection}/${tables.dev}`,
    migrations: {
      directory: "./database/migrations",
      tableName: "knex_migrations"
    },
    pool: {
      min: 2,
      max: 10
    },
    seeds: {
      directory: "./database/seeds"
    },
    useNullAsDefault: true
  },

  testing: {
    client: "pg",
    connection: `${dbConnection}/${tables.test}`,
    migrations: {
      directory: "./database/migrations",
      tableName: "knex_migrations"
    },
    pool: {
      min: 2,
      max: 10
    },
    seeds: {
      directory: "./database/seeds"
    },
    useNullAsDefault: true
  },

  production: {
    client: "pg",
    connection: `${dbConnection}?ssl=true`,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./database/migrations",
      tableName: "knex_migrations"
    },
    seeds: {
      directory: "./database/seeds"
    },
    useNullAsDefault: true
  },

  staging: {
    client: "pg",
    connection: `${dbConnection}?ssl=true`,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./database/migrations",
      tableName: "knex_migrations"
    },
    seeds: {
      directory: "./database/seeds"
    },
    useNullAsDefault: true
  }


};
