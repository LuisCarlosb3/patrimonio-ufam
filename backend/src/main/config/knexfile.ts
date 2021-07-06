import path from 'path'
interface KnexConfig {
  development: object
  test: object
  production: object
}
const migrationsData = {
  tableName: 'knex_migrations',
  directory: path.join(__dirname, '../../infra/db/helper/migrations')
}
const seedsDev = {
  directory: path.join(__dirname, '../../infra/db/helper/seeds_dev')
}
const knexConfig: KnexConfig = {

  development: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      database: 'patrimonio-dev',
      user: 'postgres',
      password: 'root'
    },
    migrations: migrationsData,
    seeds: seedsDev
  },

  test: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      database: 'patrimonio-dev',
      user: 'postgres',
      password: 'root'
    },
    migrations: migrationsData
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: '../../infra/db/helper/migrations'
    }
  }

}
export default knexConfig
