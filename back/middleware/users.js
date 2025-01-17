// middleware/users.js
const jwt = require('jsonwebtoken');
module.exports = {
  isLoggedIn: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token,'RadouanFARAH');
      req.userData = decoded;
      next();
    } catch (err) {
      return res.status(401).send({
        msg: 'Your session is not valid!'
      });
    }
  }
};

