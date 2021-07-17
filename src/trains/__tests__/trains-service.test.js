import { findNextTimeMultipleTrainsRun } from '../trains-service.js'

describe('#findNextTimeMultipleTrainsRun', () => {
  it('is undefined without trains', () => {
    expect(findNextTimeMultipleTrainsRun(undefined, '2:22')).toBeUndefined()
    expect(findNextTimeMultipleTrainsRun([], '2:22')).toBeUndefined()
  })

  it('is undefined without overlap', () => {
    expect(
      findNextTimeMultipleTrainsRun(
        [
          { name: 'ST1', times: [] },
          { name: 'ST2', times: ['1:11'] },
          { name: 'ST3', times: ['1:12'] },
        ],
        '2:22'
      )
    ).toBeUndefined()
  })

  it('finds next overlap after given time', () => {
    expect(
      findNextTimeMultipleTrainsRun(
        [
          { name: 'ST1', times: [] },
          { name: 'ST2', times: ['3:32', '3:34'] },
          { name: 'ST3', times: ['3:31', '3:32', '3:34'] },
        ],
        '2:22'
      )
    ).toEqual('3:32')
  })

  it('finds first overlap if none overlap after given time', () => {
    expect(
      findNextTimeMultipleTrainsRun(
        [
          { name: 'ST1', times: [] },
          { name: 'ST2', times: ['3:32', '3:34'] },
          { name: 'ST3', times: ['3:31', '3:32', '3:34'] },
        ],
        '3:34'
      )
    ).toEqual('3:32')
  })
})
