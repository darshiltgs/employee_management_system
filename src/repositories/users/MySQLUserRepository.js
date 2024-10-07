import UserRepository from "./UserRepository.js";
import User from "../../models/sequelize/user.model.js";

class MySQLUserRepository extends UserRepository {
  async findUserByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  async findUserByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async createUser(userData) {
    return await User.create(userData);
  }

  async findUserById(userId) {
    return await User.findByPk(userId);
  }

  async saveUser(user) {
    return await user.save();
  }
}

export default MySQLUserRepository;
