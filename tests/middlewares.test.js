// middlewares tests

const jwt = require('jsonwebtoken')
jest.mock('jsonwebtoken')

describe('Authorization middleware', () => {

  let req
  let res
  let next

  const authorization = require('../src/middlewares/autorization')

  beforeEach(() => {
    jest.resetModules()
    req = {}
    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    }
    next = jest.fn()
  })

  test('Module must return function', () => {
    expect(authorization()).toBeInstanceOf(Function)
  })

  test('Must send status 401 if token is not provided', async () => {
    await authorization()(req, res, next)
    expect(res.status).toBeCalledWith(401)
    expect(next).toBeCalledTimes(0)
  })

  test('Must send status 403 if token are wrong', async () => {
    jwt.verify.mockImplementation(() => { throw new Error })
    req.token = 'it\'s wrong token'

    await authorization()(req, res, next)
    expect(res.status).toBeCalledWith(403)
    expect(next).toBeCalledTimes(0)
  })

  test('Authorization must pass if token are correct', async () => {
    jwt.verify.mockReturnValue()
    req.token = 'blablabla'

    await authorization()(req, res, next)
    expect(next).toBeCalledTimes(1)
  })

})
