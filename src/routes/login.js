const authService = require('../services/authService');
const refreshService = require('../services/refreshService');

module.exports = (app) => {
  const collections = app.locals.collections;

  app.post('/auth', async (req, res) => {
    const { name } = req.body;
    const user = await collections['users'].findOne({ name });
  
    if (!user) {
      res.status(403).json({ message: 'Incorrect' });
      return;
    }
  
    res.json(await authService.issueToken(user._id));
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