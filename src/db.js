import mongoose from 'mongoose';
import { env } from './config';

mongoose.connect(
  env.MONGODB_URL, 
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, 
  () => mongoose.connection.db.dropDatabase()
);
export const db = mongoose.connection;

db.on('error', error => console.log('MONGO ERROR', error));
db.on('open', () => console.log('MONGODB CONNECTION OK'));