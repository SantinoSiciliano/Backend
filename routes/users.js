const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { authenticateJWT, requireAdmin, requireOwnership } = require("../middlewares/auth")


router.post("/", userController.createUser) 
router.post("/request-password-reset", userController.requestPasswordReset)
router.post("/reset-password/:token", userController.resetPassword)


router.get("/", authenticateJWT, requireAdmin, userController.getUsers)
router.get("/:id", authenticateJWT, requireOwnership, userController.getUserById)
router.put("/:id", authenticateJWT, requireOwnership, userController.updateUser)
router.delete("/:id", authenticateJWT, requireOwnership, userController.deleteUser)

module.exports = router
