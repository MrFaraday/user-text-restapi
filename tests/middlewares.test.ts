// middlewares tests

//const jwt = require('jsonwebtoken')
import jwt from 'jsonwebtoken'
jest.mock('jsonwebtoken')
const verify = <jest.Mock<typeof jwt.verify>>jwt.verify;

describe('Authorization middleware', () => {

  let req: { token?: any; }
  let res: { status: any; json?: jest.Mock<any, any>; }
  let next: jest.Mock<any, any>

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
