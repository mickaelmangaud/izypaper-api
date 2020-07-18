import passport from 'passport';
import { Router } from 'express';
import { transporter } from '../config';
import { UserDAO } from '../dao';
import { CREATED } from 'http-status-codes';
import { logger } from '../utils';
import { ajv } from '../validation';
import bcrypt from 'bcryptjs';
import loginSchema from '../validation/register.schema.json';
import cryptoRandomString from 'crypto-random-string';
import { ConflictError, UnauthorizedError, InvalidPayloadError } from '../error';

const validate = ajv.compile(loginSchema);

const router = Router({});

router.post('/register', async (req, res, next) => {
	logger.info(`[/auth/register]: user register with payload: ${JSON.stringify(req.body)}`);
	
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

	const validateString = cryptoRandomString({ length: 128 });

	await UserDAO.create({
		email: req.body.email, 
		password: hash,
		validateString
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

router.post('/validate/:token', async (req, res, next) => {
	logger.info(`[/auth/register/:token]: User ${req.body.email} asked for account validation with token : ${req.params.token}`);
	const token = req.params.token;
  
	const foundUser = await UserDAO.findUserByValidationString(token);
	if (!foundUser) {
		return next(new InvalidPayloadError('Bad token provided'));
	}

	UserDAO.setActive(foundUser._id);
	UserDAO.removeValidateString(foundUser._id);

	res.json({ 
		message: `Account: ${req.body.email} successfully validated`,
	});
});

router.post('/login', (req, res, next) => {
	logger.info(`[/auth/login]: User login with payload : ${JSON.stringify(req.body)}`);

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