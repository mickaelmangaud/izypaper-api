import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
	host: 'pro2.mail.ovh.net',
	port: 587,
	auth: {
		user: 'mickael@izypaper.com',
		pass: process.env.NODEMAILER_EMAIL_ACCOUNT_PASSWORD
	}
});