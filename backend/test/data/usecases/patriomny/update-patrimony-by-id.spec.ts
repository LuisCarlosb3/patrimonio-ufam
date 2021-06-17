import { DbCheckIfPatrimonyExists } from '@/data/protocols/db/patrimony/db-check-if-patrimony-exists-by-id'
import { NewItenToInsert, UpdatePatrimonyById, UpdatePatrimonyModel } from '@/domain/usecase/patrimony/update-patrimony-by-id'
import { UpdatePatrimonyByIdData } from '@/data/usecases/patrimony/update-patrimony-by-id'
import { Patrimony, PatrimonyState } from '@/domain/model/patrimony'
import { UserPermission } from '@/domain/model/user'
import { DbUpdatePatrimonyById } from '@/data/protocols/db/patrimony/db-update-patrimony-by-id'
import { DbInsertNewItensToPatrimony } from '@/data/protocols/db/patrimony/db-insert-new-itens-to-patrimony'
import { DbDeletePatrimonyItenById } from '@/data/protocols/db/patrimony/db-delete-patrimony-itens-by-id'
function makeDbCheckIfPatrimony (): DbCheckIfPatrimonyExists {
  class DbCheckIfPatrimonyExistsStub implements DbCheckIfPatrimonyExists {
    async verifyById (id: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new DbCheckIfPatrimonyExistsStub()
}
function makeDbUpdatePatrimonyById (): DbUpdatePatrimonyById {
  class DbUpdatePatrimonyByIdStub implements DbUpdatePatrimonyById {
    async updateById (patrimony: Patrimony): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new DbUpdatePatrimonyByIdStub()
}
function makeDbInsertNewItensToPatrimony (): DbInsertNewItensToPatrimony {
  class DbInsertNewItensToPatrimonyStub implements DbInsertNewItensToPatrimony {
    async insertItens (patrimonyId: string, itens: NewItenToInsert[]): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new DbInsertNewItensToPatrimonyStub()
}
function makeDbDeletePatrimonyItenById (): DbDeletePatrimonyItenById {
  class DbDeletePatrimonyItenByIdStub implements DbDeletePatrimonyItenById {
    async deleteById (itenId: string | string[]): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new DbDeletePatrimonyItenByIdStub()
}
function makeFakePatrimony (): UpdatePatrimonyModel {
  return {
    id: 'any_id',
    code: 'any_code',
    description: 'any_description',
    state: PatrimonyState.GOOD,
    entryDate: new Date('1/1/2021'),
    lastConferenceDate: new Date('1/1/2021'),
    value: 200,
    patrimonyItens: [],
    deletedItens: ['id1', 'id2']
  }
}
const newIten = (): {name: string, localization: string} => ({ name: 'any_item2', localization: 'any_localization' })
const updatedIten = (): {id: string, name: string, localization: string} => ({ id: 'first', name: 'any_item', localization: 'any_localization' })
interface Sut {
  sut: UpdatePatrimonyById
  verifyById: DbCheckIfPatrimonyExists
  updateById: DbUpdatePatrimonyById
  insertNewItens: DbInsertNewItensToPatrimony
  deletedById: DbDeletePatrimonyItenById
}

const makeSut = (): Sut => {
  const verifyById = makeDbCheckIfPatrimony()
  const updateById = makeDbUpdatePatrimonyById()
  const insertNewItens = makeDbInsertNewItensToPatrimony()
  const deletedById = makeDbDeletePatrimonyItenById()
  const sut = new UpdatePatrimonyByIdData(verifyById, updateById, insertNewItens, deletedById)
  return {
    sut,
    verifyById,
    updateById,
    insertNewItens,
    deletedById
  }
}

describe('UpdatePatrimonyByIdData', () => {
  test('Should call checkIfPatrimonyExistsById with patrimony id', async () => {
    const { sut, verifyById } = makeSut()
    const verifySpy = jest.spyOn(verifyById, 'verifyById')
    const patrimony = makeFakePatrimony()
    await sut.updateById(UserPermission.INVENTORIOUS, patrimony)
    expect(verifySpy).toHaveBeenCalledWith(patrimony.id)
  })
  test('Should return null if verifyById returns null', async () => {
    const { sut, verifyById } = makeSut()
    jest.spyOn(verifyById, 'verifyById').mockResolvedValueOnce(false)
    const patrimony = makeFakePatrimony()
    const res = await sut.updateById(UserPermission.INVENTORIOUS, patrimony)
    expect(res).toBeNull()
  })
  test('Should call UpdatePatrimonyById with patrimony', async () => {
    const { sut, updateById } = makeSut()
    const updateSpy = jest.spyOn(updateById, 'updateById')
    const { deletedItens, ...patrimony } = makeFakePatrimony()
    patrimony.patrimonyItens.push(updatedIten())
    await sut.updateById(UserPermission.INVENTORIOUS, patrimony)
    expect(updateSpy).toHaveBeenCalledWith(patrimony)
  })
  test('Should return true if UpdatePatrimonyById returns void', async () => {
    const { sut } = makeSut()
    const patrimony = makeFakePatrimony()
    const res = await sut.updateById(UserPermission.INVENTORIOUS, patrimony)
    expect(res).toBeTruthy()
  })
  test('Should throws if updateById throws', async () => {
    const { sut, updateById } = makeSut()
    jest.spyOn(updateById, 'updateById').mockRejectedValueOnce(new Error())
    const patrimony = makeFakePatrimony()
    const promise = sut.updateById(UserPermission.INVENTORIOUS, patrimony)
    await expect(promise).rejects.toThrow()
  })
  test('Should call DbInsertNewItensToPatrimony with patrimony id and new itens', async () => {
    const { sut, insertNewItens } = makeSut()
    const insertSpy = jest.spyOn(insertNewItens, 'insertItens')
    const patrimony = makeFakePatrimony()
    patrimony.patrimonyItens.push(newIten())
    await sut.updateById(UserPermission.INVENTORIOUS, patrimony)
    expect(insertSpy).toHaveBeenCalledWith(patrimony.id, [newIten()])
  })
  test('Should call DbDeletePatrimonyItenById with patrimony id and new itens', async () => {
    const { sut, deletedById } = makeSut()
    const deleteSpy = jest.spyOn(deletedById, 'deleteById')
    const patrimony = makeFakePatrimony()
    patrimony.patrimonyItens.push(newIten())
    await sut.updateById(UserPermission.INVENTORIOUS, patrimony)
    expect(deleteSpy).toHaveBeenCalledWith(patrimony.deletedItens)
  })
})
