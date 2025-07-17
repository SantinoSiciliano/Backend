const express = require("express")
const router = express.Router()
const sessionController = require("../controllers/sessionController")
const { authenticateJWT } = require("../middlewares/auth")


router.post("/login", sessionController.login)
router.get("/current", authenticateJWT, sessionController.current)
router.post("/logout", authenticateJWT, sessionController.logout)

module.exports = router
