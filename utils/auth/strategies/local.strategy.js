const { Strategy } = require('passport-local');

const boom = require('@hapi/boom');

const bcrypt = require('bcrypt');

const UserService = require('../../../services/user.service');

const service = new UserService();

const LocalStrategy = new Strategy(
  {
    usernameField: 'email',
  },
  async (email, password, done) => {
    try {
      const user = await service.findByEmail(email);

      if (!user) {
        done(boom.unauthorized(), false);
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        done(boom.unauthorized(), false);
      }
      delete user.dataValues.password;
      delete user.dataValues.repeatPassword;
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  },
);

module.exports = LocalStrategy;
