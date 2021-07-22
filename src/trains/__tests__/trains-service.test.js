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
          { name: 'ST2', times: ['01:11'] },
          { name: 'ST3', times: ['01:12'] },
        ],
        '02:22'
      )
    ).toBeUndefined()
  })

  it('finds next overlap after given time', () => {
    expect(
      findNextTimeMultipleTrainsRun(
        [
          { name: 'ST1', times: [] },
          { name: 'ST2', times: ['03:32', '03:34'] },
          { name: 'ST3', times: ['03:31', '03:32', '03:34'] },
        ],
        '02:22'
      )
    ).toEqual('03:32')
  })

  it('finds first overlap if no overlap after given time', () => {
    expect(
      findNextTimeMultipleTrainsRun(
        [
          { name: 'ST1', times: [] },
          { name: 'ST2', times: ['03:32', '03:34'] },
          { name: 'ST3', times: ['03:31', '03:32', '03:34'] },
        ],
        '03:34'
      )
    ).toEqual('03:32')
  })
})
