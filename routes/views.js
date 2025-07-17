const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const cartModel = require("../models/cartModel")
const viewController = require("../controllers/viewController") 


router.get("/", viewController.renderIndex)
router.get("/register", viewController.renderRegister)
router.get("/login", viewController.renderLogin)
router.get("/profile", viewController.renderProfile)
router.get("/failed", viewController.renderFailed)


router.post("/register", viewController.processRegister)
router.post("/login", viewController.processLogin)
router.post("/logout", viewController.processLogout)


router.get("/forgot-password", viewController.renderForgotPassword)
router.post("/forgot-password", viewController.processForgotPassword)
router.get("/reset-password/:token", viewController.renderResetPassword)
router.post("/reset-password/:token", viewController.processResetPassword)

module.exports = router





