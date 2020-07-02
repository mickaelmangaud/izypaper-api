import { User } from '../models';

class UserDao {
  constructor() {
    if(!UserDao.instance) {
      UserDao.instance = this;
    }
    return UserDao.instance;
  }
  
  async create(user) {
    return await User.create(user);
  }

  async update(id, newValues) {
    return await User.findByIdAndUpdate(
      id, 
      newValues,
      { useFindAndModify: false, new: true }
    )
    .select('-__v');
  }

  async setInactive(id) {
    return await this.update(id, { active: false });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id)
      .select('-password');
  }
  
  async findById(id) {
    return await User.findById(id)
      .select('-password -__v');
  }

  async findByGoogleId(id) {
    return await User.findOne({ googleID: id })
      .select('-password -__v');
  }

  async findByFacebookId(id) {
    return await User.findOne({ facebookID: id })
      .select('-password -__v');
  }

  async findUserByEmail(email) {
    return await User.findOne({ email })
      .select('_id email')
  }

  async findAll(query) {
    return await User.find({})
      // .limit(Number(query.limit) || 10)
      .select('-password -__v');
  }
}

const instance = new UserDao();

Object.freeze(instance);

export default instance;