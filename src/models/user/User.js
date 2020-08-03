import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  locale: { 
    type: String, required: false 
  },
  active: { 
    type: Boolean, required: true, default: false 
  },
  validateString: { 
    type: String, required: false 
  },
  email: { 
    type: String, required: true, unique: true 
  },
  password: { 
    type: String, required: false 
  },
  roles: { 
    type: [String],
    enum: ['ADMIN', 'USER', 'GUEST'],
    required: true,
  },
  firstName: {
    type: String, required: false,
  },
  lastName: {
    type: String, required: false,
  },
}, {
  timestamps: true,
  discriminatorKey: 'type',
  collection: 'users'
});

export default mongoose.model('User', UserSchema);
  