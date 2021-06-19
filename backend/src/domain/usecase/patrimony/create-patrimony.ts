import { Patrimony, PatrimonyItens } from '@/domain/model/patrimony'

export interface NewPatrimonyModel extends Omit<Patrimony, 'id' | 'patrimonyItens'>{
  patrimonyItens: Array<Omit<PatrimonyItens, 'id'>>
}

export interface CreateNewPatrimony {
  create(newPatrimony: NewPatrimonyModel): Promise<string>
}
