const express = require("express")
const router = express.Router()
const viewController = require("../controllers/viewController")

// Rutas para renderizar vistas
router.get("/", viewController.renderIndex)
router.get("/register", viewController.renderRegister)
router.get("/login", viewController.renderLogin)
router.get("/profile", viewController.renderProfile)
router.get("/failed", viewController.renderFailed)

// Rutas para procesar formularios
router.post("/api/sessions/register", viewController.processRegister)
router.post("/api/sessions/login", viewController.processLogin)
router.post("/api/sessions/logout", viewController.processLogout)

module.exports = router
