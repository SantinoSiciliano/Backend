const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { authenticateJWT, requireAdmin, requireOwnership } = require("../middlewares/auth")
const { validateRegistrationData } = require("../middlewares/validation")

// Rutas públicas
router.post("/", validateRegistrationData, userController.createUser) // Registro

// Rutas protegidas - Solo administradores pueden ver todos los usuarios
router.get("/", authenticateJWT, requireAdmin, userController.getUsers)

// Rutas protegidas - Usuario puede ver/editar/eliminar solo sus propios datos
router.get("/:id", authenticateJWT, requireOwnership, userController.getUserById)
router.put("/:id", authenticateJWT, requireOwnership, userController.updateUser)
router.delete("/:id", authenticateJWT, requireOwnership, userController.deleteUser)

module.exports = router