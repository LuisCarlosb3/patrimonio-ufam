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
export class PatrimonyNotFound extends Error {
  constructor (code?: string) {
    const superMessage = code ? `Patrimony not found: ${code}` : 'Patrimony not found'
    super(superMessage)
    this.name = 'PatrimonyNotFound'
  }
}
export class StatementNotFound extends Error {
  constructor (code?: string) {
    const superMessage = code ? `Responsability Statement not found: ${code}` : 'Patrimony not found'
    super(superMessage)
    this.name = 'StatementNotFound'
  }
}
export class StatementHasPatrimony extends Error {
  constructor (code?: string) {
    super('Statement has patrimonies associated')
    this.name = 'Statement has patrimonies'
  }
}
export class PatrimonyHasStatement extends Error {
  constructor (code: string) {
    const superMessage = `Patrimony ${code} already has statement`
    super(superMessage)
    this.name = 'PatrimonyHasStatement'
  }
}
export class CodeAlreadyRegistered extends Error {
  constructor () {
    super('Code already registered')
    this.name = 'CodeAlreadyRegistered'
  }
}
export class ValueInUseError extends Error {
  constructor (param: string[]) {
    const message = param.length > 1 ? param.reduce((total, partial) => `${total}, ${partial}`) : param[0]
    super(`The received ${message} is already in use`)
    this.name = 'ValueInUseError'
  }
}
