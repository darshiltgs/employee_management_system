import Department from "../../models/mongodb/department.model.js";
import { ApiError } from "../../utils/ApiError.js";

class MongooseRepository {
  constructor(collection, name) {
    this.collection = collection;
    this.name = name;
  }

  async getById(doc, id) {
    return await doc.findById(id);
  }

  async getOne(doc, obj, where) {
    return await doc.findOne(obj).where(where || {});
  }

  async createCollection(data) {
    if (data.name) {
      //   const isExist = await this.collection
      //     .findOne({
      //       name: data.name,
      //     })
      //     .where({ isDeleted: false });
      const isExist = await this.getOne(
        this.collection,
        { name: data.name },
        { isDeleted: false }
      );
      if (isExist)
        throw new ApiError(
          400,
          `${this.name} with the same name already exists`
        );
    }
    return await this.collection.create(data);
  }

  async getAllCollections(searchParams, limit, offset, populate1) {
    return await this.collection
      .find(searchParams)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("createdBy", "username") // Populate createdBy field with the user's username and email
      .populate("updatedBy", "username") // Populate updatedBy field
      .populate("deletedBy", "username");
  }

  async getCollectionById(collectionId) {
    return await this.collection
      .findById(collectionId)
      .where({ isDeleted: false })
      .populate("createdBy", "username") // Populate createdBy field with the user's username and email
      .populate("updatedBy", "username") // Populate updatedBy field
      .populate("deletedBy", "username");
  }

  async count(searchParams) {
    return await this.collection.countDocuments(searchParams);
  }

  async updateCollection(collectionId, data) {
    const collection = await this.getById(this.collection, collectionId);
    if (!collection) throw new ApiError(400, `${this.name} not found`);
    return await this.collection.findByIdAndUpdate(collectionId, data, {
      new: true,
    });
  }

  async deleteCollection(collectionId, userid) {
    const isExist = await this.getById(this.collection, collectionId);
    if (!isExist) throw new ApiError(400, `${collection} not found`);
    return await this.collection.findByIdAndUpdate(
      collectionId,
      {
        isDeleted: true,
        deletedAt: Date.now(),
        deletedBy: userid,
      },
      { new: false }
    );
  }

  async isEmailExist(email) {
    return await Employee.findOne({ email }).where({ isDeleted: false });
  }

  async isPhoneExist(phone) {
    return await Employee.findOne({ phone }).where({ isDeleted: false });
  }

  async isDepartmentExist(id) {
    return await Department.findById(id).where({ isDeleted: false });
  }

  async saveUser(user) {
    return await user.save();
  }
}

export default MongooseRepository;
