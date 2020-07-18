import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
  validateString: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    enum: ['ADMIN', 'USER', 'GUEST'],
    required: true
  },
  locale: String,
  firstName: String,
  lastName: String,
  googleID: String,
  facebookID: String,
  avatarURL: String,
});

export default mongoose.model('User', UserSchema);
  