import { formatError } from '../../common/api.js'
import { validateTrainName, validateTrainTimes } from '../trains-controller.js'

describe('#validateTrainName', () => {
  it('returns valid for a proper name', () => {
    expect(validateTrainName('ST1')).toBeUndefined()
    expect(validateTrainName('ATH2')).toBeUndefined()
    expect(validateTrainName('1234')).toBeUndefined()
  })

  it('returns error for a missing train name', () => {
    expect(validateTrainName()).toEqual(formatError('Train name is required'))
  })

  it('returns error for invalid train name', () => {
    expect(validateTrainName('ST#')).toEqual(
      formatError('Train name must be between 1 and 4 alphanumeric characters')
    )
    expect(validateTrainName('ST123')).toEqual(
      formatError('Train name must be between 1 and 4 alphanumeric characters')
    )
  })
})

describe('#validateTrainTimes', () => {
  it('returns valid for empty times', () => {
    expect(validateTrainTimes([])).toEqual([])
  })

  it('returns error for a non-array', () => {
    expect(validateTrainTimes()).toEqual(formatError('Train times is required'))
    expect(validateTrainTimes(new Date().toISOString())).toEqual(
      formatError('Train times is required')
    )
  })

  it('returns error for malformed datetimes', () => {
    expect(validateTrainTimes(['notADate'])).toEqual([
      formatError('Train time notADate is malformed'),
    ])
  })

  it('returns errors per datetime', () => {
    expect(
      validateTrainTimes(['notADate', 'stillNot', '1234-15-44T25:70:90Z'])
    ).toEqual([
      formatError('Train time notADate is malformed'),
      formatError('Train time stillNot is malformed'),
      formatError('Train time 1234-15-44T25:70:90Z is malformed'),
    ])
  })
})
