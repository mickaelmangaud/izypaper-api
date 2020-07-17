import { Router, json } from 'express';
import { ConflictError, UnauthorizedError, InvalidPayloadError } from '../error';
import { BAD_REQUEST, CREATED } from 'http-status-codes';
import { UserDAO } from '../dao';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { ajv } from '../validation';
import loginSchema from '../validation/login.schema.json';

const validate = ajv.compile(loginSchema);

const router = Router({});

router.post('/register', async (req, res, next) => {
  const valid = validate(req.body);
  if (!valid) {
    return next(new InvalidPayloadError('Invalid Payload error', validate.errors));
  }

  const user = await UserDAO.findUserByEmail(req.body.email);
  if (user) {
    return next(new ConflictError(`User with email ${user.email} already exists`));
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  await UserDAO.create({email: req.body.email, password: hash});
  
  res.status(CREATED).json({
    message: 'User created', 
    user: {
      email: req.body.email
    }
  })
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return next(new UnauthorizedError('Invalid credentials'));
    }

    req.logIn(user, err => {
      if (err) next(err);
      return res.json({user});
    })
  })(req, res, next);
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    req.logout();
    res.clearCookie('connect.sid')
    return res.end();
  });
});

router.get('/user', (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError('User not authentified'));
  }

  res.json({ user: req.user });
});

export default router;