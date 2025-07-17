const cartService = require("../services/cartService")

class CartController {
  async getCartByUserId(req, res) {
    try {
      const { userId } = req.params
      const cart = await cartService.getCartByUserId(userId)

      res.json({
        status: "success",
        cart,
      })
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async addProductToCart(req, res) {
    try {
      const { cartId } = req.params
      const { productId, quantity = 1 } = req.body

      const updatedCart = await cartService.addProductToCart(cartId, productId, quantity)

      res.json({
        status: "success",
        message: "Producto agregado al carrito exitosamente",
        cart: updatedCart,
      })
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async removeProductFromCart(req, res) {
    try {
      const { cartId, productId } = req.params

      const updatedCart = await cartService.removeProductFromCart(cartId, productId)

      res.json({
        status: "success",
        message: "Producto eliminado del carrito exitosamente",
        cart: updatedCart,
      })
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async clearCart(req, res) {
    try {
      const { cartId } = req.params

      const updatedCart = await cartService.clearCart(cartId)

      res.json({
        status: "success",
        message: "Carrito vaciado exitosamente",
        cart: updatedCart,
      })
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      })
    }
  }
}

module.exports = new CartController()

