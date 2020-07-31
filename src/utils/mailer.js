import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
	host: 'pro2.mail.ovh.net',
	port: 587,
	auth: {
		user: process.env.NODEMAILER_EMAIL,
		pass: process.env.NODEMAILER_PASSWORD
	}
});