const { ObjectId } = require("mongodb")
const { getDb } = require("../config/db")

class CartModel {
  constructor() {
    this.collection = "carts"
  }

  // Crear un nuevo carrito
  async createCart(userId = null) {
    const db = getDb()
    const newCart = {
      userId: userId ? new ObjectId(userId) : null,
      products: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection(this.collection).insertOne(newCart)
    return { ...newCart, _id: result.insertedId }
  }

  // Buscar carrito por ID
  async findById(id) {
    const db = getDb()
    try {
      return db.collection(this.collection).findOne({ _id: new ObjectId(id) })
    } catch (error) {
      if (error.name === "BSONError") {
        throw new Error("ID de carrito inválido")
      }
      throw error
    }
  }

  // Buscar carrito por ID de usuario
  async findByUserId(userId) {
    const db = getDb()
    try {
      return db.collection(this.collection).findOne({ userId: new ObjectId(userId) })
    } catch (error) {
      if (error.name === "BSONError") {
        throw new Error("ID de usuario inválido")
      }
      throw error
    }
  }

  // Eliminar carrito
  async deleteCart(id) {
    const db = getDb()
    try {
      const result = await db.collection(this.collection).deleteOne({ _id: new ObjectId(id) })
      return result.deletedCount > 0
    } catch (error) {
      if (error.name === "BSONError") {
        throw new Error("ID de carrito inválido")
      }
      throw error
    }
  }
}

module.exports = new CartModel()