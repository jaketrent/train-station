import supertest from 'supertest'

import { createApp } from '../../app.js'

describe('GET /api/trains', () => {
  let request

  beforeAll(() => {
    const app = createApp()
    request = supertest(app)
  })

  it('returns json', async () => {
    const res = await request.get('/api/trains')

    expect(res.status).toEqual(200)
    expect(res.body).toEqual({ wow: 'trains' })
  })
})
