import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  googleID: String,
  facebookID: String,
  locale: String,
  email: {
    type: String,
    required: true,
  },
  password: String,
  firstName: String,
  lastName: String,
  avatarURL: String,
});

export default mongoose.model('User', UserSchema);
  