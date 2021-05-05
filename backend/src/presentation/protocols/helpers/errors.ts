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
  constructor (param: string) {
    super(`Invalid param: ${param}`)
    this.name = 'InvalidParamError'
  }
}
export class AccessDeniedError extends Error {
  constructor () {
    super('Access denied')
    this.name = 'AccessDenied'
  }
}
export class EmailInUseError extends Error {
  constructor () {
    super('The received email is already in use')
    this.name = 'EmailInUseError'
  }
}
