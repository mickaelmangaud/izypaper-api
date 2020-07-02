import { Router } from 'express';
import { ConflictError } from '../error';
import { UserDAO } from '../dao';
import passport from 'passport';
import bcrypt from 'bcryptjs';

const router = Router({});

router.post('/register', async (req, res, next) => {
  // TODO Valider le payload
  const user = await UserDAO.findUserByEmail(req.body.email);
  if (user) {
    next(new ConflictError(`User with email ${user.email} already exists`));
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

/*** Local Passport ***/
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  
  console.log('login route', req.user)
  if (req.user) {
    res.cookie('my-test-cookie', 'supervalue')
    res.json(req.user);
  }
});

/*** Google OAuth ***/
router.get('/google',passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', passport.authenticate('google'));

/*** Facebook OAuth ***/
router.get('/facebook',passport.authenticate('facebook', { scope: 'email' }));

router.get('/facebook/callback', passport.authenticate('facebook'));

/** Logout user  **/
router.get('/logout', (req, res, next) => {
  req.logout();
});

export default router;