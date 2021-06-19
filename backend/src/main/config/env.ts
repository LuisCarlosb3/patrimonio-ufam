export default {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'mjwthashsecrete@2021',
  hostname: 'http://localhost:3000'
}
