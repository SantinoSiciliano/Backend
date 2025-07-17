const express = require("express")
const router = express.Router()
const cartController = require("../controllers/cartController")
const { authenticateJWT, requireUser, requireOwnership } = require("../middlewares/auth")

router.use(authenticateJWT)


router.get("/user/:userId", requireOwnership, cartController.getCartByUserId)


router.post("/:cartId/products", requireUser, cartController.addProductToCart)
router.delete("/:cartId/products/:productId", requireUser, cartController.removeProductFromCart)
router.delete("/:cartId", requireUser, cartController.clearCart)

module.exports = router
