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

  it('returns errors for malformed datetimes', () => {
    expect(
      validateTrainTimes(['notADate', '123:123', '25:60', '03:30PM'])
    ).toEqual([
      formatError(
        'Train time notADate is malformed. Must be in hh:mm 24-hr format.'
      ),
      formatError(
        'Train time 123:123 is malformed. Must be in hh:mm 24-hr format.'
      ),
      formatError(
        'Train time 25:60 is malformed. Must be in hh:mm 24-hr format.'
      ),
      formatError(
        'Train time 03:30PM is malformed. Must be in hh:mm 24-hr format.'
      ),
    ])
  })
})
