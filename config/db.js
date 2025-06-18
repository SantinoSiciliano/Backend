const { MongoClient } = require("mongodb")
require("dotenv").config()

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)
let db

async function connectToDatabase() {
  try {
    await client.connect()
    console.log("✅ Conectado exitosamente a MongoDB Atlas")
    db = client.db("ecommerce")

    // Crear índices para mejorar el rendimiento
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    console.log("✅ Índices creados correctamente")

    return db
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error)
    process.exit(1)
  }
}

function getDb() {
  if (!db) {
    throw new Error("La base de datos no está inicializada. Llama a connectToDatabase primero.")
  }
  return db
}

async function closeConnection() {
  try {
    await client.close()
    console.log("✅ Conexión a MongoDB cerrada correctamente")
  } catch (error) {
    console.error("❌ Error al cerrar la conexión:", error)
  }
}

module.exports = { connectToDatabase, getDb, client, closeConnection }