import mongoose from 'mongoose';
import { env } from './config';
import { User } from './models';

const users = [
  {
    email: 'mickael@izypaper.com',
    password: '$2a$10$mvI8mj6w5sWtKRQ23IqG3OMkRsvFrtgh2Ut61icuEAMeSCIDjDY/6',
    roles: ['ADMIN']
  },
  {
    email: 'cecile@izypaper.com',
    password: '$2a$10$j6h.xwGMICOpaCfcAdilj.OsgHvLAcsQEdig2i87yorGBaFBsbZPe',
    roles: ['ADMIN']
  },
  {
    email: 'malo@izypaper.com',
    password: '$2a$10$jnhs4.1DKl5gS5jaW0wKhusl0XRCqaAXBMDzAiEDqBYEphlH8lJNe',
    roles: ['ADMIN']
  }
]

mongoose.connect(
  env.MONGODB_URL, 
  {  useNewUrlParser: true, useUnifiedTopology: true }
);
export const db = mongoose.connection;



db.on('error', error => console.log('MONGO ERROR', error));
db.on('open', () => {
  console.log(`[MONGODB] : Connection OK`);
  users.map(user => {
    User.create(user);
  });
});