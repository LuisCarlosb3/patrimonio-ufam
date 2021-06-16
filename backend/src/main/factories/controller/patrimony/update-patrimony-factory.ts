import { UpdatePatrimonyController } from '@/presentation/controllers/patrimony/update-patrimony-controller'
import { makeLoadUserById } from '../../usecases/load-user-by-id/load-user-by-id-factory'
import { makeUpdatePatrimonyById } from '../../usecases/update-patrimony/update-patrimony-by-id-factory'
import { HttpController } from '@/presentation/protocols/http-controller'
import { ValidatorJsAdapter } from '@/infra/validation/validatorjs-adapter'
import { PatrimonyState } from '@/domain/model/patrimony'

export function makeUpdatePatrimonyController (): HttpController {
  const rules = {
    patrimony: {
      id: 'required|string',
      code: 'required|string',
      description: 'required|string',
      state: ['required', { in: [PatrimonyState.GOOD, PatrimonyState.NEW, PatrimonyState.UNECONOMICAL, PatrimonyState.UNRECOVERABLE, PatrimonyState.UNSERVIBLE] }],
      entryDate: 'required|date',
      lastConferenceDate: 'required|date',
      value: 'required|numeric',
      'patrimonyItens.*.id': 'required|string',
      'patrimonyItens.*.name': 'required|string',
      'patrimonyItens.*.localization': 'required|string',
      'patrimonyItens.*.observation': 'string'
    }

  }
  const validator = new ValidatorJsAdapter(rules)
  const loadUserById = makeLoadUserById()
  const updatePatrimonyById = makeUpdatePatrimonyById()
  const updatePatrimony = new UpdatePatrimonyController(validator, loadUserById, updatePatrimonyById)
  return updatePatrimony
}
