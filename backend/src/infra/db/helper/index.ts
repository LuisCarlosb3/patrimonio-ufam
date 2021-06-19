import { knex } from 'knex'
import knexConfig from '@/main/config/knexfile'
import config from '@/main/config/env'
const env = config.env
export default knex(knexConfig[env])
