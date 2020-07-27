import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  locale: String,
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
    type: String, required: true 
  },
  roles: { 
    type: [String], enum: ['ADMIN', 'USER', 'GUEST'], required: true 
  },
  firstName: {
    type: String, required: true,
  },
  lastName: {
    type: String, requiredPaths: true,
  },
}, {
  timestamps: true,
  discriminatorKey: 'type',
  collection: 'users'
});

export default mongoose.model('User', UserSchema);
  