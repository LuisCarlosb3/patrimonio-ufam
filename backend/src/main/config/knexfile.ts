interface KnexConfig {
  development: object
  test: object
  production: object
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
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/infra/db/helper/migrations'
    }
  },

  test: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      database: 'patrimonio-dev',
      user: 'postgres',
      password: 'root'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/infra/db/helper/migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
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
