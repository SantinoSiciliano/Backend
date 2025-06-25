const express = require("express")
const router = express.Router()
const cartModel = require("../models/cartModel")
const { authenticateJWT, requireOwnership } = require("../middlewares/auth")

router.get("/user/:userId", authenticateJWT, requireOwnership, async (req, res) => {
  try {
    const { userId } = req.params
    const cart = await cartModel.findByUserId(userId)

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      })
    }

    res.json({
      status: "success",
      cart,
    })
  } catch (error) {
    console.error("Error al obtener carrito:", error)
    res.status(500).json({
      status: "error",
      message: error.message || "Error interno del servidor",
    })
  }
})

module.exports = router
