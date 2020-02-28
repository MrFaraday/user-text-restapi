// refreshService.js

const refreshTokens = [];

const add = async (user) => {
  refreshTokens.push(user);
}

const find = async(token) => {
  return refreshTokens.find((el, index, arr) => el.token === token);
}

const remove = async (user) => {
  const index = refreshTokens.indexOf(user);
  refreshTokens.splice(index, 1);
}

module.exports = {
  add,
  find,
  remove
}
