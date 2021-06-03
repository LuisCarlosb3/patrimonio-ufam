export class ServerError extends Error {
  constructor (stack: string) {
    super('Internal server error')
    this.name = 'ServerError'
    this.stack = stack
  }
}

export class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}
export class MissingParamError extends Error {
  constructor (param: string) {
    super(`Missing param: ${param}`)
    this.name = 'MissingParamError'
  }
}
export class InvalidParamError extends Error {
  constructor (param: string[]) {
    const message = param.length > 1 ? param.reduce((total, partial) => `${total}, ${partial}`) : param[0]
    super(`Invalid param: ${message}`)
    this.name = 'InvalidParamError'
  }
}
export class AccessDeniedError extends Error {
  constructor () {
    super('Access denied')
    this.name = 'AccessDenied'
  }
}
export class ValueInUseError extends Error {
  constructor (param: string[]) {
    const message = param.length > 1 ? param.reduce((total, partial) => `${total}, ${partial}`) : param[0]
    super(`The received ${message} is already in use`)
    this.name = 'ValueInUseError'
  }
}
