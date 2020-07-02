import { Strategy as GoogleStrategy} from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserDAO } from '../dao';
import passport from 'passport';
import env from './env';

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const foundUser = await UserDAO.findById(id);
    done(null, foundUser);
});

/*** LOCAL STRATEGY ***/
passport.use(new LocalStrategy(
  { usernameField: 'email'},
  async (email, password, done) => {
    /* Ici la requete POST doit bien prendre un "username" et non un "email" */
    const user = await UserDAO.findUserByEmail(email);
    if (!user) {
      // console.log('utilisateur existe pas')
      return done(null, false, { message: 'utilsateur existe pas message'});
    }
    return done(null, user);
  }
));

/*** GOOGLE STRATEGY ***/
passport.use(new GoogleStrategy({
    clientID: env.oauth.google.CLIENT_ID,
    clientSecret: env.oauth.google.CLIENT_SECRET,
    callbackURL: `${env.BASE_API_URL}/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    const user = await UserDAO.findByGoogleId(profile.id);
    if (!user) {
        // console.log('Passport google strategy : Utilisateur existe pas')
        const { email, given_name, family_name, picture, locale } = profile._json;

        const newUser = await UserDAO.create({
            googleID: profile.id,
            locale,
            email,
            firstName: given_name,
            lastName: family_name,
            avatarURL: picture,
        });
        return done(null, newUser);
    }
    // console.log('Passport google strategy : Utilisateur existe')
    return done(null, user);
  }
));

/*** FACEBOOK STRATEGY ***/
passport.use(new FacebookStrategy({
    clientID: env.oauth.facebook.APP_ID,
    clientSecret: env.oauth.facebook.SECRET_KEY,
    callbackURL: `${env.BASE_API_URL}/auth/facebook/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    const user = await UserDAO.findByFacebookId(profile.id);

    if (!user) {
      const { id, displayName, name: { familyName, givenName }, profileUrl } = profile;

      const newUser = await UserDAO.create({
          facebookID: id,
          facebookProfileURL: profileUrl,
          firstName: givenName,
          lastName: familyName,
          facebookDisplayName: displayName
      });
      return done(null, newUser);
    }

    return done(null, user);
  }
));