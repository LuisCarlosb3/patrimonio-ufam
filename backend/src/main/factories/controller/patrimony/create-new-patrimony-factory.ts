import { PatrimonyState } from '@/domain/model/patrimony'
import { ValidatorJsAdapter } from '@/infra/validation/validatorjs-adapter'
import { CreateNewpatrimonyController } from '@/presentation/controllers/patrimony/create-new-patrimony-controller'
import { makeCreateNewPatrimonyData } from '../../usecases/patrimony/create-new-patrimony/create-new-patrimony-data-factory'

export function makeCreateNewPatrimony (): CreateNewpatrimonyController {
  const rules = {
    code: 'required|string',
    description: 'required|string',
    state: ['required', { in: [PatrimonyState.GOOD, PatrimonyState.NEW, PatrimonyState.UNECONOMICAL, PatrimonyState.UNRECOVERABLE, PatrimonyState.UNSERVIBLE] }],
    entryDate: 'required|date',
    lastConferenceDate: 'required|date',
    value: 'required|numeric',
    patrimonyItens: 'required',
    'patrimonyItens.*.name': 'required|string',
    'patrimonyItens.*.localization': 'required|string',
    'patrimonyItens.*.observation': 'string'
  }

  const createValidation = new ValidatorJsAdapter(rules)
  const createPatrionyData = makeCreateNewPatrimonyData()
  const controller = new CreateNewpatrimonyController(createValidation, createPatrionyData)
  return controller
}
