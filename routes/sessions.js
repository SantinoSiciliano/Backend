const express = require("express")
const router = express.Router()
const sessionController = require("../controllers/sessionController")
const { authenticateJWT } = require("../middlewares/auth")
const { validateLoginData } = require("../middlewares/validation")

router.post("/login", validateLoginData, sessionController.login)
router.get("/current", authenticateJWT, sessionController.current) 
router.post("/logout", authenticateJWT, sessionController.logout)

module.exports = router