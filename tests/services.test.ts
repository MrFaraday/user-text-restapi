// Tests for services

describe('issueToken function:', () => {

  const { issueToken } = require('../src/services/authService')

  test('Function must be decladed', () => {
    expect(issueToken).toBeDefined()
  })

  test('Must return response object', async () => {
    const userId = 'testId'
    expect(await issueToken(userId)).toMatchObject({
      access_token: expect.any(String),
      refreshToken: expect.any(String),
      expiresIn: expect.any(Number)
    })
  })

})

describe('Refresh service', () => {

  let add: (arg0: { user_id: string; token: string }) => any
  let find: (arg0: string) => any
  let remove: (arg0: { user_id: string; token: string }) => any

  beforeEach(() => {
    const refreshService = require('../src/services/refreshService')
    add = refreshService.add
    find = refreshService.find
    remove = refreshService.remove
    jest.resetModules()
  })

  const user = {
    user_id: 'useridtest',
    token: 'refreshtoken'
  }

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
