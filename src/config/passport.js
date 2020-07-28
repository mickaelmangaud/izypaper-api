import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserDAO } from '../dao';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { UnauthorizedError } from '../error';
import { logger } from '../utils';

passport.serializeUser((user, done) => {
    logger.info(`[PASSPORT]: Serialized user : ${JSON.stringify(user)}`);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const foundUser = await UserDAO.findById(id);
        logger.info(`[PASSPORT]: Deserialized user : ${JSON.stringify(foundUser)}`);
        done(null, {
            id: foundUser._id, 
            email: foundUser.email,
            roles: foundUser.roles
        });
    } catch (err) {
        logger.error(`[PASSPORT DESERIALIZE]: Failed to deserialize user :`, err);
    }
});

/*** LOCAL STRATEGY ***/
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
        logger.info(`[PASSPORT LocalStrategy]: Payload : ${JSON.stringify({username, password})}`);

        const foundUser = await UserDAO.findUserByEmail(username);
        logger.info(`[PASSPORT LocalStrategy]: Found user : ${JSON.stringify(foundUser)}`);
        if (!foundUser) {
            // Ici il faudrait peut-être retourner une erreur
            return done(null, false);
        };

        if(!foundUser.active) {
            logger.error(`[PASSPORT LocalStrategy]: Non active user`, !foundUser.active);
            return done(new UnauthorizedError('User not active, please verify email adress'), false);
        }
        
        const isMatch = await bcrypt.compare(password, foundUser.password);
        logger.info(`[PASSPORT LocalStrategy]: Matching user : ${isMatch}`);
        if (!isMatch) {
            return done(new UnauthorizedError('Email ou mot de passe incorrect'), false);
        };

        const user = {
            id: foundUser._id,
            email: foundUser.email,
            // roles: foundUser.roles
        };

        done(null, user);
}));

/*** GOOGLE STRATEGY ***/
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_API_URL}/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    logger.info(`[PASSPORT GoogleStrategy]: Profile`, profile);

    const foundUser = await UserDAO.findByGoogleId(profile.id);
    logger.info(`[PASSPORT GoogleStrategy]: Found user : ${JSON.stringify(foundUser)}`);
        if (!foundUser) {
            const createdUser = await UserDAO.createGoogleUser({
                firstName: profile._json.given_name,
                lastName: profile._json.family_name,
                email: profile._json.email,
                password: 'none',
                googleID: profile.id
            });
            return done(null, createdUser);
        };

    return done(null, foundUser);
  }
));