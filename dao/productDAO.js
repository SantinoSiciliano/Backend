const { ObjectId } = require("mongodb")
const { getDb } = require("../config/db")

class ProductDAO {
  constructor() {
    this.collection = "products"
  }

  async create(productData) {
    const db = getDb()
    const result = await db.collection(this.collection).insertOne(productData)
    return { ...productData, _id: result.insertedId }
  }

  async findById(id) {
    const db = getDb()
    return db.collection(this.collection).findOne({ _id: new ObjectId(id) })
  }

  async findAll(filter = {}, options = {}) {
    const db = getDb()
    return db.collection(this.collection).find(filter, options).toArray()
  }

  async update(id, productData) {
    const db = getDb()
    const result = await db.collection(this.collection).updateOne({ _id: new ObjectId(id) }, { $set: productData })
    return result.modifiedCount > 0
  }

  async delete(id) {
    const db = getDb()
    const result = await db.collection(this.collection).deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  async updateStock(id, newStock) {
    const db = getDb()
    const result = await db
      .collection(this.collection)
      .updateOne({ _id: new ObjectId(id) }, { $set: { stock: newStock } })
    return result.modifiedCount > 0
  }
}

module.exports = new ProductDAO()

