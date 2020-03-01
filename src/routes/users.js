const bearerToken = require('express-bearer-token');
const authorization = require('../middlewares/autorization');

module.exports = (app) => {
  const collections = app.locals.collections;

  app.get(/^\/users(\/[0-9]*)?$/, bearerToken(), authorization(), async (req, res) => {
    try {
      pageFromURL = req.originalUrl.match(/\d\d*/g) || [];  // извлекаем номер страницы, если нет - пустой массив
      const page = parseInt(pageFromURL[0]) || 1;  // т.к. у null не массив, то вверху присваевам пустой и здесь не ловим ошибку
      const users_size = await collections['users'].countDocuments();
  
      // 3 users on page
      let totalPages = Math.floor(users_size / 3);
      users_size % 3 === 0 || totalPages++;
      if (totalPages < page) return res.status(400).json({ message: 'Incorrect page' });
  
      const users = await collections['users'].find()
        .project({ password: 0 })
        .skip((page - 1) * 3)
        .limit(3)
        .toArray();
  
      for (const user of users) {
        const text = await collections['text'].find({ user_id: user._id }).toArray();
        user.texts = text;
      }
  
      res.json({
        users,
        page,
        totalPages,
        usersCount: users_size
      });
    } catch (e) {
      res.status(500).json({ message: 'Server Error' });
      console.log(e);
    }
  });
}