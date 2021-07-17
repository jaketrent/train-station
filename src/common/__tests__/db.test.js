import * as db from '../db'

describe('db', () => {
  let dbInstance = db.connect()

  it('has no keys', () => {
    expect(dbInstance.keys()).toEqual([])
  })

  it('returns undefined for unset key', () => {
    expect(dbInstance.fetch()).toBeUndefined()
    expect(dbInstance.fetch('unsetKey')).toBeUndefined()
  })

  it('sets and returns keys', () => {
    const value = { aribtrary: 'value' }
    expect(dbInstance.set('someKey', value)).toBeUndefined()
    expect(dbInstance.fetch('someKey')).toEqual(value)
    expect(dbInstance.keys()).toEqual(['someKey'])
    // TODO: could validate different data type setting and fetching
    // TODO: could validate multiple keys, collisions
  })
})
