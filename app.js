const express = require("express")
const { engine } = require("express-handlebars")
const cookieParser = require("cookie-parser")
const { connectToDatabase, client } = require("./config/db")
require("dotenv").config()

const app = express()

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./views")


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.use("/", require("./routes/views"))


app.use("/api/users", require("./routes/users"))
app.use("/api/sessions", require("./routes/sessions"))


app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    status: "error",
    message: "Algo salió mal!",
  })
})


const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    
    await connectToDatabase()

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`)
      console.log(`Interfaz web disponible en: http://localhost:${PORT}`)
      console.log(`API disponible en: http://localhost:${PORT}/api`)
    })

    
    process.on("SIGINT", async () => {
      await client.close()
      console.log("Conexión a MongoDB cerrada")
      process.exit(0)
    })
  } catch (error) {
    console.error("Error al iniciar el servidor:", error)
    process.exit(1)
  }
}

startServer()

module.exports = app
