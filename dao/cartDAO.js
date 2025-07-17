const { ObjectId } = require("mongodb")
const { getDb } = require("../config/db")

class CartDAO {
  constructor() {
    this.collection = "carts"
  }

  async create(cartData) {
    const db = getDb()
    const result = await db.collection(this.collection).insertOne(cartData)
    return { ...cartData, _id: result.insertedId }
  }

  async findById(id) {
    const db = getDb()
    return db.collection(this.collection).findOne({ _id: new ObjectId(id) })
  }

  async findByUserId(userId) {
    const db = getDb()
    return db.collection(this.collection).findOne({ userId: new ObjectId(userId) })
  }

  async update(id, cartData) {
    const db = getDb()
    const result = await db.collection(this.collection).updateOne({ _id: new ObjectId(id) }, { $set: cartData })
    return result.modifiedCount > 0
  }

  async delete(id) {
    const db = getDb()
    const result = await db.collection(this.collection).deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  async addProduct(cartId, productData) {
    const db = getDb()
    await db.collection(this.collection).updateOne({ _id: new ObjectId(cartId) }, { $push: { products: productData } })
    return this.findById(cartId)
  }

  async removeProduct(cartId, productId) {
    const db = getDb()
    await db
      .collection(this.collection)
      .updateOne({ _id: new ObjectId(cartId) }, { $pull: { products: { productId: new ObjectId(productId) } } })
    return this.findById(cartId)
  }

  async clearProducts(cartId) {
    const db = getDb()
    await db.collection(this.collection).updateOne({ _id: new ObjectId(cartId) }, { $set: { products: [] } })
    return this.findById(cartId)
  }
}

module.exports = new CartDAO()

