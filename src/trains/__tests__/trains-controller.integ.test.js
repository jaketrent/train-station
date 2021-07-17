import supertest from 'supertest'

import { createApp } from '../../app.js'

describe('POST /api/trains', () => {
  let request
  const existingTrain = {
    name: 'EXST',
    times: ['3:33'],
  }

  beforeAll(() => {
    const seedDb = {
      [existingTrain.name]: existingTrain,
    }
    const app = createApp(seedDb)
    request = supertest(app)
  })

  describe('invalid trains', () => {
    test('malformed request format', async () => {
      const trainOnly = {
        name: 'ST1',
        times: [],
      }
      const malformedMissingWrapper = trainOnly
      const res = await request
        .post('/api/trains')
        .send(malformedMissingWrapper)

      expect(res.status).toEqual(400)
      expect(res.body.errors).toEqual([{ title: 'Malformed request' }])
    })

    test('bad name and times', async () => {
      const train = {
        times: ['badDatetime', '2:23'],
      }
      const res = await request.post('/api/trains').send({ data: train })

      expect(res.status).toEqual(400)
      expect(res.body.errors).toEqual([
        { title: 'Train name is required' },
        {
          title:
            'Train time badDatetime is malformed. Must be in hh:mm 24-hr format.',
        },
      ])
    })

    test('pre-existing train', async () => {
      const train = {
        name: existingTrain.name,
        times: ['8:41'],
      }
      const res = await request.post('/api/trains').send({ data: train })

      expect(res.status).toEqual(409)
      expect(res.body.errors).toEqual([
        { title: 'Train ' + train.name + ' already exists' },
      ])
    })
  })

  it('creates new train', async () => {
    const train = {
      name: 'ST1',
      times: ['9:36', '10:37', '23:59', '00:00'],
    }
    const res = await request.post('/api/trains').send({ data: train })

    expect(res.status).toEqual(201)
    expect(res.body.data).toEqual(train)
  })
})

describe('GET /api/trains/overlaps/:after', () => {
  it('has a time with multiple trains arriving at a time', async () => {
    const seedDb = {
      ST1: ['4:44', '5:55'],
      ST2: ['3:33', '4:44', '5:55'],
      ST3: ['3:33', '4:44', '5:55'],
    }
    const app = createApp(seedDb)
    const request = supertest(app)

    const res = await request.get('/api/trains/overlaps/2:22')

    expect(res.status).toEqual(200)
    const expectedDate = new Date()
    expectedDate.setHours(3)
    expectedDate.setMinutes(33)
    expectedDate.setSeconds(0)
    expectedDate.setMilliseconds(0)
    expect(res.body.data).toEqual({ time: expectedDate.toISOString() })
  })
})
