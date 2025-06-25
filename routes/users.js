const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { authenticateJWT, requireAdmin, requireOwnership } = require("../middlewares/auth")
const { validateRegistrationData } = require("../middlewares/validation")

router.post("/", validateRegistrationData, userController.createUser) 


router.get("/", authenticateJWT, requireAdmin, userController.getUsers)


router.get("/:id", authenticateJWT, requireOwnership, userController.getUserById)
router.put("/:id", authenticateJWT, requireOwnership, userController.updateUser)
router.delete("/:id", authenticateJWT, requireOwnership, userController.deleteUser)

module.exports = router