const cartModel = require("../models/cartModel")
const userModel = require("../models/userModel")

class CartController {
  async getCurrentUserCart(req, res) {
    try {
      const userId = req.user._id

      let cart = await cartModel.findByUserId(userId)

      if (!cart) {
        cart = await cartModel.createCart(userId)
        await userModel.updateUser(userId, { cartId: cart._id })
      }

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

  async getCartById(req, res) {
    try {
      const cartId = req.params.id
      const cart = await cartModel.findById(cartId)

      if (!cart) {
        return res.status(404).json({
          status: "error",
          message: "Carrito no encontrado",
        })
      }

      if (req.user.role !== "admin" && cart.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "error",
          message: "Acceso denegado. Solo puedes acceder a tu propio carrito",
        })
      }

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
      const cartId = req.params.id
      const { productId, quantity = 1 } = req.body

      const cart = await cartModel.findById(cartId)
      if (!cart) {
        return res.status(404).json({
          status: "error",
          message: "Carrito no encontrado",
        })
      }

      if (req.user.role !== "admin" && cart.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "error",
          message: "Acceso denegado. Solo puedes modificar tu propio carrito",
        })
      }

      
      const updatedCart = await cartModel.addProduct(cartId, productId, quantity)

      res.json({
        status: "success",
        message: "Producto agregado al carrito exitosamente",
        cart: updatedCart,
      })
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      })
    }
  }

  
  async updateProductQuantity(req, res) {
    try {
      const cartId = req.params.id
      const productId = req.params.productId
      const { quantity } = req.body

      
      const cart = await cartModel.findById(cartId)
      if (!cart) {
        return res.status(404).json({
          status: "error",
          message: "Carrito no encontrado",
        })
      }

      
      if (req.user.role !== "admin" && cart.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "error",
          message: "Acceso denegado. Solo puedes modificar tu propio carrito",
        })
      }

      
      await cartModel.removeProduct(cartId, productId)
      const updatedCart = await cartModel.addProduct(cartId, productId, quantity)

      res.json({
        status: "success",
        message: "Cantidad actualizada exitosamente",
        cart: updatedCart,
      })
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      })
    }
  }

  
  async removeProductFromCart(req, res) {
    try {
      const cartId = req.params.id
      const productId = req.params.productId

      
      const cart = await cartModel.findById(cartId)
      if (!cart) {
        return res.status(404).json({
          status: "error",
          message: "Carrito no encontrado",
        })
      }

      
      if (req.user.role !== "admin" && cart.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "error",
          message: "Acceso denegado. Solo puedes modificar tu propio carrito",
        })
      }

      
      const updatedCart = await cartModel.removeProduct(cartId, productId)

      res.json({
        status: "success",
        message: "Producto eliminado del carrito exitosamente",
        cart: updatedCart,
      })
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      })
    }
  }

  
  async emptyCart(req, res) {
    try {
      const cartId = req.params.id

      
      const cart = await cartModel.findById(cartId)
      if (!cart) {
        return res.status(404).json({
          status: "error",
          message: "Carrito no encontrado",
        })
      }

      
      if (req.user.role !== "admin" && cart.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "error",
          message: "Acceso denegado. Solo puedes modificar tu propio carrito",
        })
      }

      
      const updatedCart = await cartModel.emptyCart(cartId)

      res.json({
        status: "success",
        message: "Carrito vaciado exitosamente",
        cart: updatedCart,
      })
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      })
    }
  }
}

module.exports = new CartController()
