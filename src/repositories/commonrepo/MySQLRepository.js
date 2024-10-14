import { ApiError } from "../../utils/ApiError.js";

class MySQLRepository {
  constructor(collection, name) {
    this.collection = collection;
    this.name = name;
  }

  async createCollection(data) {
    if (data.name) {
      const existingRecord = await this.collection.findOne({
        where: { name: data.name, isDeleted: false },
      });
      if (existingRecord) {
        throw new ApiError(
          400,
          `${this.name} with the same name already exists`
        );
      }
    }
    return await this.collection.create(data);
  }

  async getAllCollections(searchParams = {}, limit, offset) {
    return await this.collection.findAll({
      where: { ...searchParams, isDeleted: false },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        { association: "createdBy", attributes: ["username"] },
        { association: "updatedBy", attributes: ["username"] },
        { association: "deletedBy", attributes: ["username"] },
      ],
    });
  }

  async getCollectionById(id) {
    const record = await this.collection.findOne({
      where: { id, isDeleted: false },
      include: [
        { association: "createdBy", attributes: ["username"] },
        { association: "updatedBy", attributes: ["username"] },
        { association: "deletedBy", attributes: ["username"] },
      ],
    });
    if (!record) throw new ApiError(400, `${this.name} not found`);
    return record;
  }

  async count(searchParams = {}) {
    return await this.collection.count({
      where: { ...searchParams, isDeleted: false },
    });
  }

  async findByName(name) {
    return await this.collection.findOne({
      where: { name, isDeleted: false },
    });
  }

  async updateCollection(id, data) {
    const record = await this.collection.findByPk(id);
    if (!record) throw new ApiError(400, `${this.name} not found`);
    return await record.update(data);
  }

  async deleteCollection(id, userId) {
    const record = await this.collection.findByPk(id);
    if (!record) throw new ApiError(400, `${this.name} not found`);
    return await record.update({
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
    });
  }

  async getById(doc, id) {
    return await doc.findByPk(id);
  }

  async getOne(doc, obj, where) {
    console.log("Hee");
    return await doc.findOne({
      where: obj,
    });
  }

  async saveUser(user) {
    return await user.save();
  }
}

export default MySQLRepository;
