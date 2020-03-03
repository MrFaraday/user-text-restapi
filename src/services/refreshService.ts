interface refreshTokenRecord {
  userId: string
  token: string
}

const refreshTokens: refreshTokenRecord[] = []

const add = async (user: refreshTokenRecord) => {
  refreshTokens.push(user)
}

const find = async(token: string) => {
  return refreshTokens.find((el, index, arr) => el.token === token)
}

const remove = async (user: refreshTokenRecord) => {
  const index = refreshTokens.indexOf(user)
  refreshTokens.splice(index, 1)
}

export default {
  add,
  find,
  remove
}
