import mongoose from 'mongoose';
import User from './User';

const GoogleUser = User.discriminator(
    'GoogleUser', 
    new mongoose.Schema({
        googleID: { 
            type: String, required: true
        },
    }),
);

export default mongoose.model('GoogleUser');
  