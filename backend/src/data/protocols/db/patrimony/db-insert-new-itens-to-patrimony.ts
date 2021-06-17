import { NewItenToInsert } from '@/domain/usecase/patrimony/update-patrimony-by-id'

export interface DbInsertNewItensToPatrimony {
  insertItens(patrimonyId: string, itens: NewItenToInsert[]): Promise<void>
}
