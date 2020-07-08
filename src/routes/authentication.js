import { Router, json } from 'express';
import { ConflictError, UnauthorizedError } from '../error';
import { UserDAO } from '../dao';
import passport from 'passport';
import bcrypt from 'bcryptjs';

const router = Router({});

router.post('/register', async (req, res, next) => {
  // TODO Valider le payload
  const user = await UserDAO.findUserByEmail(req.body.email);
  if (user) {
    return next(new ConflictError(`User with email ${user.email} already exists`));
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  await UserDAO.create({email: req.body.email, password: hash});
  
  res.json({
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
      return next(new UnauthorizedError('Email ou mot de pass incorrect'));
    }

    req.logIn(user, err => {
      if (err) next(err);
      return res.json({user});
    })
  })(req, res, next);
});

router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.end();
});

router.get('/user', (req, res, next) => {
  if (req.user) {
    return res.json({ user: req.user });
  } else {
    return next(new UnauthorizedError('Pas de user dans la req'));
  }
});

export default router;