import passport from 'passport';
import { CREATED } from 'http-status-codes';
import { Router } from 'express';
import { UserDAO } from '../dao';
import { logger, transporter } from '../utils';
import { ajv, loginSchema, registerSchema } from '../validation';
import { ConflictError, UnauthorizedError, InvalidPayloadError } from '../error';
import cryptoRandomString from 'crypto-random-string';
import bcrypt from 'bcryptjs';

const validateUserRegistration = ajv.compile(registerSchema);
const validateUserLogin = ajv.compile(loginSchema);

const router = Router({});

router.post('/register', async (req, res, next) => {
	logger.info(`[/auth/register]: user register with payload: ${JSON.stringify(req.body)}`);

	const valid = validateUserRegistration(req.body);
	if (!valid) {
		return next(new InvalidPayloadError('Invalid Payload error', validateUserRegistration.errors));
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

router.get('/validate/:token', async (req, res, next) => {
	logger.info(`[/auth/register/:token]: Account validation requested with token : ${req.params.token}`);
	const token = req.params.token;
  
	const foundUser = await UserDAO.findUserByValidationString(token);
	logger.info(`[/auth/register/:token] Account validation found user : ${JSON.stringify(foundUser)}`);
	if (!foundUser) {
		return next(new InvalidPayloadError('Bad token provided'));
	}

	await UserDAO.setActive(foundUser._id);
	await UserDAO.removeValidateString(foundUser._id);

	res.status(200).json({ 
		message: `Account: ${req.body.email} successfully validated`,
	});
});

router.post('/login', (req, res, next) => {
	logger.info(`[/auth/login] User login with payload : ${JSON.stringify(req.body)}`);

	const valid = validateUserLogin(req.body);
	if (!valid) {
		return next(new InvalidPayloadError('Invalid Payload error', validateUserLogin.errors));
	}

	passport.authenticate('local', (err, user, info) => {
		if (err) return next(err);
		if (!user) {
			return next(new UnauthorizedError('Invalid credentials'));
		}	
		
		req.logIn(user, err => {
			logger.info(`[/auth/login] Passport authenticate with user : ${JSON.stringify(user)}`);
			if (err) next(err);
			return res.status(200).json({user});
		})
	})(req, res, next);
});

router.get('/logout', (req, res, next) => {
	req.session.destroy(error => {
		if (error) {
			console.log('LOGOUT ERROR', error)
		}

		req.logout();
		res.clearCookie('connect.sid');
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