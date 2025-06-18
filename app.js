const express = require("express")
const cors = require("cors")
const passport = require("./config/passport")
const { connectToDatabase, closeConnection } = require("./config/db")
require("dotenv").config()

const app = express()

// Middlewares globales
app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Inicializar Passport
app.use(passport.initialize())

// Middleware para logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Rutas principales
app.use("/api/users", require("./routes/users"))
app.use("/api/sessions", require("./routes/sessions"))
app.use("/api/carts", require("./routes/carts"))

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "API Ecommerce funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      sessions: "/api/sessions",
      carts: "/api/carts",
    },
    authentication: "JWT con Passport",
    database: "MongoDB Atlas",
  })
})

// Ruta para verificar el estado de la API
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: "MongoDB Atlas",
    authentication: "Passport + JWT",
  })
})

// Manejo de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Ruta ${req.originalUrl} no encontrada`,
  })
})

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error("Error global:", err.stack)

  // Error de validación de MongoDB
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Error de validación",
      details: err.message,
    })
  }

  // Error de duplicado de MongoDB
  if (err.code === 11000) {
    return res.status(400).json({
      status: "error",
      message: "Recurso duplicado",
      details: "El recurso que intentas crear ya existe",
    })
  }

  // Error de JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "error",
      message: "Token inválido",
    })
  }

  // Error de token expirado
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "error",
      message: "Token expirado",
    })
  }

  // Error genérico
  res.status(500).json({
    status: "error",
    message: "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  })
})

// Función para iniciar el servidor
async function startServer() {
  try {
    // Conectar a MongoDB Atlas
    await connectToDatabase()

    const PORT = process.env.PORT || 3000

    const server = app.listen(PORT, () => {
      console.log(`
🚀 Servidor iniciado exitosamente
📍 Puerto: ${PORT}
🌐 URL: http://localhost:${PORT}
📊 Estado: Funcionando
🗄️  Base de datos: MongoDB Atlas conectada
🔐 Autenticación: Passport + JWT
⏰ Tiempo: ${new Date().toLocaleString()}
      `)
    })

    // Manejo de cierre graceful
    const gracefulShutdown = async (signal) => {
      console.log(`\n🛑 Recibida señal ${signal}. Cerrando servidor...`)

      server.close(async () => {
        console.log("🔌 Servidor HTTP cerrado")

        try {
          await closeConnection()
          console.log("✅ Cierre exitoso")
          process.exit(0)
        } catch (error) {
          console.error("❌ Error durante el cierre:", error)
          process.exit(1)
        }
      })

      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        console.log("⏰ Forzando cierre...")
        process.exit(1)
      }, 10000)
    }

    // Escuchar señales de cierre
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
    process.on("SIGINT", () => gracefulShutdown("SIGINT"))

    // Manejo de errores no capturados
    process.on("unhandledRejection", (reason, promise) => {
      console.error("❌ Unhandled Rejection at:", promise, "reason:", reason)
      gracefulShutdown("unhandledRejection")
    })

    process.on("uncaughtException", (error) => {
      console.error("❌ Uncaught Exception:", error)
      gracefulShutdown("uncaughtException")
    })
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error)
    process.exit(1)
  }
}

// Iniciar servidor solo si este archivo es ejecutado directamente
if (require.main === module) {
  startServer()
}

module.exports = app