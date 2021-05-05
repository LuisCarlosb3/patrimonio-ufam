import env from './config/env'
import 'module-alias/register'
import server from './config/app'

server.listen(env.port, () => console.log(`running at ${env.port}`))

