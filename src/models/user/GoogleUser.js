import mongoose from 'mongoose';
import User from './User';

const GoogleUser = User.discriminator('GoogleUser', new mongoose.Schema({

    }),
);

export default mongoose.model('GoogleUser');
  