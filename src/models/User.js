import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    enum: ['ADMIN', 'USER', 'GUEST'],
  },
  locale: String,
  firstName: String,
  lastName: String,
  googleID: String,
  facebookID: String,
  avatarURL: String,
});

export default mongoose.model('User', UserSchema);
  