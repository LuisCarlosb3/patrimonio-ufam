import express, { json, Request, Response, NextFunction } from 'express'
import { Server } from 'http'
import configRoutes from './routes'
const app = express()
const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('access-control-allow-origin', '*')
  res.set('access-control-allow-methods', '*')
  res.set('access-control-allow-headers', '*')
  res.type('json')
  return next()
}

app.use(cors)
app.use(json())
configRoutes(app)
const server = new Server(app)
export default server
