// middlewares tests

const jwt = require('jsonwebtoken')
jest.mock('jsonwebtoken')
const verify = <jest.Mock<typeof jwt.verify>>jwt.verify

describe('Authorization middleware', () => {

  let req
  let res
  let next

  const authorization = require('../src/middlewares/autorization').authorization

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
    verify.mockImplementation(() => { throw new Error })
    req.token = 'it\'s wrong token'

    await authorization()(req, res, next)
    expect(res.status).toBeCalledWith(403)
    expect(next).toBeCalledTimes(0)
  })

  test('Authorization must pass if token are correct', async () => {
    verify.mockReset()
    req.token = 'blablabla'

    await authorization()(req, res, next)
    expect(next).toBeCalledTimes(1)
  })

})
