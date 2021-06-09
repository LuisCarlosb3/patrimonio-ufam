import { DbCheckPatrimonyByCode } from '@/data/protocols/db/patrimony/db-load-patrimony-by-code'
import { CheckPatrimonyExistsData } from '@/data/usecases/patrimony/check-patrimony-exists'

function makeDbCheckPatrimonyByCode (): DbCheckPatrimonyByCode {
  class DbCheckPatrimonyByCodeStub implements DbCheckPatrimonyByCode {
    async checkByCode (code: string): Promise<string> {
      return await Promise.resolve('any_code')
    }
  }
  return new DbCheckPatrimonyByCodeStub()
}
interface Sut {
  sut: CheckPatrimonyExistsData
  dbCheckPatrimonyByCode: DbCheckPatrimonyByCode
}
function makeSut (): Sut {
  const dbCheckPatrimonyByCode = makeDbCheckPatrimonyByCode()
  const sut = new CheckPatrimonyExistsData(dbCheckPatrimonyByCode)
  return {
    sut,
    dbCheckPatrimonyByCode
  }
}
describe('CheckPatrimonyExistsData', () => {
  test('ensure CheckPatrimonyExists calls checkByCode with received code', async () => {
    const { sut, dbCheckPatrimonyByCode } = makeSut()
    const checkSpy = jest.spyOn(dbCheckPatrimonyByCode, 'checkByCode')
    await sut.loadByCode('any_code')
    expect(checkSpy).toHaveBeenCalledWith('any_code')
  })
  test('ensure CheckPatrimonyExists returns true if code exists', async () => {
    const { sut } = makeSut()
    const response = await sut.loadByCode('any_code')
    expect(response).toBeTruthy()
  })
  test('ensure CheckPatrimonyExists returns false if code not exists', async () => {
    const { sut, dbCheckPatrimonyByCode } = makeSut()
    jest.spyOn(dbCheckPatrimonyByCode, 'checkByCode').mockResolvedValueOnce(null)
    const response = await sut.loadByCode('any_code')
    expect(response).toBeFalsy()
  })
})
