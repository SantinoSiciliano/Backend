const { ObjectId } = require("mongodb")
const bcrypt = require("bcrypt")
const { getDb } = require("../config/db")

class UserModel {
  constructor() {
    this.collection = "users"
  }

  // Crear un nuevo usuario
  async createUser(userData) {
    const db = getDb()

    // Validar datos requeridos
    if (!userData.first_name || !userData.last_name || !userData.email || !userData.age || !userData.password) {
      throw new Error("Todos los campos son requeridos")
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      throw new Error("Formato de email inválido")
    }

    // Validar edad
    if (userData.age < 1 || userData.age > 120) {
      throw new Error("La edad debe estar entre 1 y 120 años")
    }

    // Encriptar la contraseña usando hashSync como pide la consigna
    const hashedPassword = bcrypt.hashSync(userData.password, 10)

    const newUser = {
      first_name: userData.first_name.trim(),
      last_name: userData.last_name.trim(),
      email: userData.email.toLowerCase().trim(),
      age: parseInt(userData.age),
      password: hashedPassword,
      role: userData.role || "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    try {
      const result = await db.collection(this.collection).insertOne(newUser)
      return { ...newUser, _id: result.insertedId }
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("El email ya está registrado")
      }
      throw error
    }
  }

  // Buscar usuario por email
  async findByEmail(email) {
    const db = getDb()
    return db.collection(this.collection).findOne({ email: email.toLowerCase().trim() })
  }

  // Buscar usuario por ID
  async findById(id) {
    const db = getDb()
    try {
      return db.collection(this.collection).findOne({ _id: new ObjectId(id) })
    } catch (error) {
      if (error.name === "BSONError") {
        throw new Error("ID de usuario inválido")
      }
      throw error
    }
  }

  // Obtener todos los usuarios (sin contraseñas)
  async findAll() {
    const db = getDb()
    return db
      .collection(this.collection)
      .find({}, { projection: { password: 0 } })
      .toArray()
  }

  // Actualizar usuario
  async updateUser(id, userData) {
    const db = getDb()

    // Preparar datos para actualizar
    const updateData = {
      updatedAt: new Date(),
    }

    if (userData.first_name) updateData.first_name = userData.first_name.trim()
    if (userData.last_name) updateData.last_name = userData.last_name.trim()
    if (userData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(userData.email)) {
        throw new Error("Formato de email inválido")
      }
      updateData.email = userData.email.toLowerCase().trim()
    }
    if (userData.age) {
      const age = parseInt(userData.age)
      if (age < 1 || age > 120) {
        throw new Error("La edad debe estar entre 1 y 120 años")
      }
      updateData.age = age
    }

    try {
      const result = await db.collection(this.collection).updateOne({ _id: new ObjectId(id) }, { $set: updateData })
      return result.modifiedCount > 0
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("El email ya está registrado")
      }
      if (error.name === "BSONError") {
        throw new Error("ID de usuario inválido")
      }
      throw error
    }
  }

  // Eliminar usuario
  async deleteUser(id) {
    const db = getDb()
    try {
      const result = await db.collection(this.collection).deleteOne({ _id: new ObjectId(id) })
      return result.deletedCount > 0
    } catch (error) {
      if (error.name === "BSONError") {
        throw new Error("ID de usuario inválido")
      }
      throw error
    }
  }

  // Comparar contraseña
  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword)
  }
}

module.exports = new UserModel()