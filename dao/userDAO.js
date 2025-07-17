const { ObjectId } = require("mongodb")
const { getDb } = require("../config/db")

class UserDAO {
  constructor() {
    this.collection = "users"
  }

  async create(userData) {
    const db = getDb()
    const result = await db.collection(this.collection).insertOne(userData)
    return { ...userData, _id: result.insertedId }
  }

  async findByEmail(email) {
    const db = getDb()
    return db.collection(this.collection).findOne({ email })
  }

  async findById(id) {
    const db = getDb()
    return db.collection(this.collection).findOne({ _id: new ObjectId(id) })
  }

  async findAll() {
    const db = getDb()
    return db.collection(this.collection).find({}).toArray()
  }

  async update(id, userData) {
    const db = getDb()
    const result = await db.collection(this.collection).updateOne({ _id: new ObjectId(id) }, { $set: userData })
    return result.modifiedCount > 0
  }

  async delete(id) {
    const db = getDb()
    const result = await db.collection(this.collection).deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  async findByResetToken(token) {
    const db = getDb()
    return db.collection(this.collection).findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    })
  }
}

module.exports = new UserDAO()
