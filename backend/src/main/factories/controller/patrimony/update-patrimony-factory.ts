import { UpdatePatrimonyController } from '@/presentation/controllers/patrimony/update-patrimony-controller'
import { makeLoadUserById } from '../../usecases/user/load-user-by-id/load-user-by-id-factory'
import { makeUpdatePatrimonyById } from '../../usecases/patrimony/update-patrimony/update-patrimony-by-id-factory'
import { makeCheckPatrimonyIdAndCodeToUpdate } from '../../usecases/patrimony/verify-patrimony-by-id-and-code/verify-patrimony-by-id-and-code-factory'
import { HttpController } from '@/presentation/protocols/http-controller'
import { ValidatorJsAdapter } from '@/infra/validation/validatorjs-adapter'
import { PatrimonyState } from '@/domain/model/patrimony'

export function makeUpdatePatrimonyController (): HttpController {
  const rules = {
    patrimony: {
      id: ['required', 'string', 'regex:/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i'],
      code: 'required|string',
      description: 'required|string',
      state: ['required', { in: [PatrimonyState.GOOD, PatrimonyState.NEW, PatrimonyState.UNECONOMICAL, PatrimonyState.UNRECOVERABLE, PatrimonyState.UNSERVIBLE] }],
      entryDate: 'required|date',
      lastConferenceDate: 'required|date',
      value: 'required|numeric',
      'patrimonyItens.*.id': ['string', 'regex:/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i'],
      'patrimonyItens.*.name': 'required|string',
      'patrimonyItens.*.localization': 'required|string',
      'patrimonyItens.*.observation': 'string',
      deletedItens: 'array'
    }

  }
  const validator = new ValidatorJsAdapter(rules)
  const loadUserById = makeLoadUserById()
  const updatePatrimonyById = makeUpdatePatrimonyById()
  const checkPatrimonyIdAndCode = makeCheckPatrimonyIdAndCodeToUpdate()
  const updatePatrimony = new UpdatePatrimonyController(validator, loadUserById, updatePatrimonyById, checkPatrimonyIdAndCode)
  return updatePatrimony
}
