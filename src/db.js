import mongoose from 'mongoose';
import { env } from './config';
import { User } from './models';
import { logger } from './utils';

const users = [
  {
    email: 'mickael@izypaper.com',
    password: '$2a$10$mvI8mj6w5sWtKRQ23IqG3OMkRsvFrtgh2Ut61icuEAMeSCIDjDY/6',
    roles: ['ADMIN'],
    active: true
  },
  {
    email: 'cecile@izypaper.com',
    password: '$2a$10$j6h.xwGMICOpaCfcAdilj.OsgHvLAcsQEdig2i87yorGBaFBsbZPe',
    roles: ['ADMIN'],
    active: true
  },
  {
    email: 'malo@izypaper.com',
    password: '$2a$10$jnhs4.1DKl5gS5jaW0wKhusl0XRCqaAXBMDzAiEDqBYEphlH8lJNe',
    roles: ['ADMIN'],
    active: true
  }
]

mongoose.connect(
  env.MONGODB_URL, 
  {  useNewUrlParser: true, useUnifiedTopology: true }
);
export const db = mongoose.connection;

db.on('error', error => {
  logger.error('[MONGOOSE CONNECTION]: Error :', error);
});

db.on('open', () => {
  logger.info(`[MONGODB]: Connection OK`);
  users.map(user => {
    User.create(user);
  });
});