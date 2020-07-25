import mongoose from 'mongoose';
import { env } from './config';
import { User } from './models';
import { logger } from './utils';

const users = [
  {
    email: 'mickael@izypaper.com',
    password: '$2a$10$mvI8mj6w5sWtKRQ23IqG3OMkRsvFrtgh2Ut61icuEAMeSCIDjDY/6',
    firstName: 'Mickael',
    lastName: 'Mangaud',
    roles: ['ADMIN'],
    active: true
  },
  {
    email: 'cecile@izypaper.com',
    password: '$2a$10$j6h.xwGMICOpaCfcAdilj.OsgHvLAcsQEdig2i87yorGBaFBsbZPe',
    firstName: 'Cécile',
    lastName: 'Amiah',
    roles: ['ADMIN'],

    active: true
  },
  {
    email: 'malo@izypaper.com',
    password: '$2a$10$RNcGh466BbM7KZwr1IcvMegqeDNUM/Acmc5AdvO.ZWQLABv5.L8.G',
    firstName: 'Malo',
    lastName: 'Michel',
    roles: ['ADMIN'],
    active: true
  }
]

mongoose.connect(
  env.MONGODB_URL, 
  {  useNewUrlParser: true, useUnifiedTopology: true }
);

/* Used to avoid warning : 
  "DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead."
*/
mongoose.set('useCreateIndex', true);

export const db = mongoose.connection;

db.on('error', error => {
  logger.error('[MONGOOSE CONNECTION]', error);
});

db.on('open', async () => {
  logger.info(`[MONGODB]: Connection OK`);
  await User.deleteMany({});

  users.map(async user => { await User.create(user) });
});