// Tests for services

describe('issueToken function:', () => {

  const issueToken = require('../src/services/authService').default

  test('Function must be decladed', () => {
    expect(issueToken).toBeDefined()
  })

  test('Must return response object', async () => {
    const userId = 'testId'
    expect(await issueToken(userId)).toMatchObject({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
      expires_in: expect.any(Number)
    })
  })

})

describe('Refresh service', () => {

  let add
  let find
  let remove

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
