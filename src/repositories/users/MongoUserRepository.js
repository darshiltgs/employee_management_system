import UserRepository from "./UserRepository.js";
import User from "../../models/mongodb/user.model.js";

class MongoUserRepository extends UserRepository {
  async findUserByUsername(username) {
    return await User.findOne({ username });
  }

  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async createUser(userData) {
    return await User.create(userData);
  }

  async findUserById(userId) {
    return await User.findById(userId);
  }

  async saveUser(user) {
    return await user.save();
  }
}

export default MongoUserRepository;
