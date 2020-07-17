import mongoose from 'mongoose';
import { env } from './config';
import { UserDAO } from './dao';

const users = [
  {
    email: 'mickael@izypaper.com',
    password: 'mickael',
    roles: ['ADMIN']
  },
  {
    email: 'cecile@izypaper.com',
    password: 'cecile',
    roles: ['ADMIN']
  },
  {
    email: 'malo@izypaper.com',
    password: 'malo',
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
  
});