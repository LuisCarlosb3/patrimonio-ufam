import { UserPermission } from '@/domain/model/user'
import { EmailSender } from '@/infra/email/email-adapter'
import { ValidatorJsAdapter } from '@/infra/validation/validatorjs-adapter'
import { AdminCreateNewUserController } from '@/presentation/controllers/user/admin-create-new-user-controller'
import { makeCreateNewUser } from '../../usecases/user/admin-create-user/create-new-user-factory'

export function makeAdminCreateNewUserController (): AdminCreateNewUserController {
  const rules = {
    name: 'required',
    registration: 'required',
    email: 'required|email',
    permission: ['required', { in: [UserPermission.ADMINISTRATOR, UserPermission.INVENTORIOUS] }],
    password: 'required|min:8'
  }

  const userValidation = new ValidatorJsAdapter(rules)
  const createNewUser = makeCreateNewUser()
  const emailSender = new EmailSender()
  const adminCreate = new AdminCreateNewUserController(userValidation, createNewUser, emailSender)
  return adminCreate
}
