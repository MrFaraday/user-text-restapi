const bearerToken = require('express-bearer-token');
const authorization = require('../middlewares/autorization');

module.exports = (app) => {
  const collections = app.locals.collections;

  app.get(/^\/\w\w*$/, bearerToken(), authorization(), async (req, res) => {
    try {
      const userName = req.originalUrl.split('/')[1];  // извлекаем имя пользователя
      const user = await collections['users'].findOne({ name: userName }, { fields: { password: 0 } });

      if (!user) {
        res.status(400).json({ message: 'User not found' });
        return;
      }

      const text = await collections['text'].find({ user_id: user._id }).toArray();

      res.json({
        ...user,
        text
      });
    } catch (e) {
      res.status(500).json({ message: 'Server Error' });
      console.log(e);
    }
  });
}