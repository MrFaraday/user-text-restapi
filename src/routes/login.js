const issueToken = require('../services/authService');
const refreshService = require('../services/refreshService');
const bcrypt = require('bcryptjs');

module.exports = (app) => {
  const collections = app.locals.collections;

  app.post('/auth', async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
      res.status(401).json({ message: 'No data provided' });
      return;
    }

    const user = await collections['users'].findOne({ name }, { fields: { password: 1 } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(403).json({ message: 'Incorrect username or password' });
      return;
    }

    res.json(await issueToken(user._id));
  });

  app.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    const user = await refreshService.find(refreshToken);
    if (!user) {
      res.status(403).json({ message: 'Wrong token' });
      return;
    }

    const userId = user.userId;
    await refreshService.remove(user);
    res.json(await authService.issueToken(userId));
  });
}