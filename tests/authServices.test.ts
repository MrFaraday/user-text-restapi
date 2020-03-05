// Tests for services

import { authenticate, refresh } from '../src/services/authService'

describe('authenticate function:', () => {

  test('Function must be decladed', () => {
    expect(authenticate).toBeDefined()
  })

  test('Must return response object', async () => {
    const name = 'test'
    const pass ='test'
    expect(await authenticate(name, pass)).toMatchObject({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
      expires_in: expect.any(Number)
    })
  })

})

/* describe('refresh function', () => {

  const user = {
    user_id: 'useridtest',
    token: 'refreshtoken'
  }

  beforeEach(() => {
    const refreshService = require('../src/services/refreshService').default
    add = refreshService.add
    find = refreshService.find
    remove = refreshService.remove
    jest.resetModules()
  })

  test('Service must add user with token into array and find it by token', async () => {
    await add(user)
    expect(await find(user.token)).toEqual(user)
  })

  test('Token must be removed after remove() function', async () => {
    await add(user)
    await remove(user)
    expect(await find(user.token)).toBeUndefined()
  })

})
 */