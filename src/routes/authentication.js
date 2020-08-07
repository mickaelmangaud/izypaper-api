import passport from 'passport';
import { CREATED, OK } from 'http-status-codes';
import { Router } from 'express';
import { UserDAO } from '../dao';
import { logger, transporter } from '../utils';
import { ajv, loginSchema, registerSchema } from '../validation';
import { ConflictError, UnauthorizedError, InvalidPayloadError } from '../error';
import cryptoRandomString from 'crypto-random-string';
import bcrypt from 'bcryptjs';

const validateRegister = ajv.compile(registerSchema);
const validateLogin = ajv.compile(loginSchema);

const router = Router({ });

router.put('/register', async (req, res, next) => {
	logger.info(`[/auth/register]: user register with payload: ${JSON.stringify(req.body)}`);

	const valid = validateRegister(req.body);
	if (!valid) {
		return next(new InvalidPayloadError('Invalid Payload error', validateRegister.errors));
	}

	const user = await UserDAO.findUserByEmail(req.body.email);
	if (user) {
		return next(new ConflictError(`User with email ${user.email} already exists`));
	}
  
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(req.body.password, salt);

	const validateString = cryptoRandomString({ length: 128 });

	await UserDAO.create({
		...req.body,
		validateString,
		password: hash
	});

	transporter.sendMail({
		from: `mickael@izypaper.com`,
		to: `${req.body.email}`,
		subject: `Bonjour ${req.body.email} Votre inscription sur l'application Izypaper`,
		text: `Ceci est la version texte du message`,
		html: `
			<p>Bienvenue chez Izypaper!</p>
			<p>Client sur 
				<a href="${process.env.BASE_API_URL}/auth/validate/${validateString}">ce lien</a>
				pour valider votre inscription
			</p>
		`
	});

	res.status(CREATED).json({
		message: `User ${req.body.email} created, please check your mails for validation`, 
		user: {
			email: req.body.email
		}
	})
});

router.get('/validate/:string', async (req, res, next) => {
	logger.info(`[/auth/register/:string]: Account validation requested with :string : ${req.params.string}`);
	const string = req.params.string;
  
	const foundUser = await UserDAO.findUserByValidationString(string);
	logger.info(`[/auth/register/:string] Account validation found user : ${JSON.stringify(foundUser)}`);
	if (!foundUser) {
		return next(new InvalidPayloadError('Bad string'));
	}

	await UserDAO.setActive(foundUser._id);
	await UserDAO.removeValidateString(foundUser._id);

	res.status(OK).json({ 
		message: `Account: ${req.body.email} successfully validated`,
	});
});

/*** PASSPORT LOCAL STRATEGY */
router.post('/login', (req, res, next) => {
	logger.info(`[/auth/login] User login with payload : ${JSON.stringify(req.body)}`);

	const valid = validateLogin(req.body);
	if (!valid) {
		return next(new InvalidPayloadError('Invalid Payload error', validateLogin.errors));
	}

	passport.authenticate('local', (err, user, info) => {
		if (err) return next(err);
		if (!user) {
			return next(new UnauthorizedError('Invalid credentials'));
		}	
		
		req.logIn(user, err => {
			logger.info(`[/auth/login] Passport LocalStragey authenticate with user : ${JSON.stringify(user)}`);
			if (err) next(err);
			return res.status(OK).json({user});
		})
	})(req, res, next);
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
	successRedirect: `${process.env.CLIENT_URL}`
}));

router.get('/logout', (req, res, next) => {
	req.session.destroy(error => {
		if (error) {
			logger.error('[/auth/logout] Passport Logout Error', error);
		}

		req.logout();
		res.clearCookie('izypaper.sid');
		return res.end();
	});
});

router.get('/user', (req, res, next) => {
	logger.info(`[/auth/user] User in Request: ${req.user}`);
	if (!req.user) {
		logger.error('[/auth/user] Error: No user in req');
		return next(new UnauthorizedError('User not authentified'));
	}

	delete req.user.roles

  	res.status(OK).json({ user: req.user });
});

export default router;