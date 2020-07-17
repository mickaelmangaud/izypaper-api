import { Strategy as LocalStrategy } from 'passport-local';
import { UserDAO } from '../dao';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { UnauthorizedError } from '../error';

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const foundUser = await UserDAO.findById(id);
    done(null, {
        id: foundUser.id, 
        email: foundUser.email
    });
});

/*** LOCAL STRATEGY ***/
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
        const foundUser = await UserDAO.findUserByEmail(username);
        if (!foundUser) {
            return done(null, false);
        };

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return done(new UnauthorizedError('Email ou mot de passe incorrect'), false);
        };

        const user = {
            id: foundUser._id,
            email: foundUser.email,
        };

        done(null, user);
}));