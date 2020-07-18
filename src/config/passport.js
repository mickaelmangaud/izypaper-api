import { Strategy as LocalStrategy } from 'passport-local';
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
    const foundUser = await UserDAO.findById(id);
    logger.info(`[PASSPORT]: Deserialized user : ${JSON.stringify(foundUser)}`);
    done(null, {
        id: foundUser._id, 
        email: foundUser.email
    });
});

/*** LOCAL STRATEGY ***/
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
        logger.info(`[PASSPORT LocalStrategy]: Payload : ${JSON.stringify({username, password})}`);

        const foundUser = await UserDAO.findUserByEmail(username);
        logger.info(`[PASSPORT LocalStrategy]: Found user : ${JSON.stringify(foundUser)}`);
        if (!foundUser) {
            return done(null, false);
        };
        
        const isMatch = await bcrypt.compare(password, foundUser.password);
        logger.info(`[PASSPORT LocalStrategy]: Matching user : ${isMatch}`);
        if (!isMatch) {
            return done(new UnauthorizedError('Email ou mot de passe incorrect'), false);
        };

        const user = {
            id: foundUser._id,
            email: foundUser.email,
        };

        done(null, user);
}));