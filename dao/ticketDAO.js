const { ObjectId } = require("mongodb")
const { getDb } = require("../config/db")

class TicketDAO {
  constructor() {
    this.collection = "tickets"
  }

  async create(ticketData) {
    const db = getDb()
    const result = await db.collection(this.collection).insertOne(ticketData)
    return { ...ticketData, _id: result.insertedId }
  }

  async findById(id) {
    const db = getDb()
    return db.collection(this.collection).findOne({ _id: new ObjectId(id) })
  }

  async findByCode(code) {
    const db = getDb()
    return db.collection(this.collection).findOne({ code })
  }

  async findByUserId(userId) {
    const db = getDb()
    return db.collection(this.collection).find({ purchaser: userId }).toArray()
  }

  async findAll() {
    const db = getDb()
    return db.collection(this.collection).find({}).toArray()
  }
}

module.exports = new TicketDAO()

