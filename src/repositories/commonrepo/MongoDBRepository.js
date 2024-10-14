class MongoDBRepository {
  constructor(collection, name) {
    this.collection = collection;
    this.name = name;
  }

  async getById(doc, id) {
    return await doc.findById(id);
  }

  async getOne(doc, obj) {
    return await doc.findOne(obj);
  }

  async saveUser(user) {
    return await user.save();
  }

  async createCollection(data) {
    const existingDocument = await this.collection.findOne({
      name: data.name,
      isDeleted: false,
    });
    if (existingDocument) {
      throw new Error(`${this.name} with the same name already exists`);
    }
    const result = await this.collection.insertOne(data);
    console.log(result);
    return { ...data, _id: result.insertedId };
  }

  async getAllCollections(searchParams = {}, limit = 10, offset = 0) {
    return await this.collection
      .find({ ...searchParams, isDeleted: false })
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();
  }

  async getCollectionById(id) {
    return await this.collection.findOne({ _id: id, isDeleted: false });
  }

  async count(searchParams = {}) {
    return await this.collection.countDocuments({
      ...searchParams,
      isDeleted: false,
    });
  }

  async updateCollection(id, updateData) {
    const result = await this.collection.findOneAndUpdate(
      { _id: id.toString() },
      { $set: updateData },
      { returnOriginal: false }
    );
    console.log(result);
    if (!result.value) {
      throw new Error(`${this.name} not found`);
    }
    return result.value;
  }

  async deleteCollection(id, userId) {
    const result = await this.collection.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: userId,
        },
      },
      { returnOriginal: false }
    );
    if (!result.value) {
      throw new Error(`${this.name} not found`);
    }
    return result.value;
  }
}

export default MongoDBRepository;
