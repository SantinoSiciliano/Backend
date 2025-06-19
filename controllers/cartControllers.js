const cartModel = require("../models/cartModel")
const userModel = require("../models/userModel")

class CartController {
  // Obtener carrito del usuario actual
  async getCurrentUserCart(req, res) {
    try {
      const userId = req.user._id

      // Buscar carrito del usuario
      let cart = await cartModel.findByUserId(userId)

      // Si no tiene carrito, crear uno
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

  // Obtener carrito por ID
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

      // Verificar que el usuario sea el propietario del carrito o admin
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

  // Agregar producto al carrito
  async addProductToCart(req, res) {
    try {
      const cartId = req.params.id
      const { productId, quantity = 1 } = req.body

      // Verificar que el carrito existe
      const cart = await cartModel.findById(cartId)
      if (!cart) {
        return res.status(404).json({
          status: "error",
          message: "Carrito no encontrado",
        })
      }

      // Verificar que el usuario sea el propietario del carrito o admin
      if (req.user.role !== "admin" && cart.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "error",
          message: "Acceso denegado. Solo puedes modificar tu propio carrito",
        })
      }

      // Agregar producto al carrito
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

  // Actualizar cantidad de producto en el carrito
  async updateProductQuantity(req, res) {
    try {
      const cartId = req.params.id
      const productId = req.params.productId
      const { quantity } = req.body

      // Verificar que el carrito existe
      const cart = await cartModel.findById(cartId)
      if (!cart) {
        return res.status(404).json({
          status: "error",
          message: "Carrito no encontrado",
        })
      }

      // Verificar que el usuario sea el propietario del carrito o admin
      if (req.user.role !== "admin" && cart.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "error",
          message: "Acceso denegado. Solo puedes modificar tu propio carrito",
        })
      }

      // Primero eliminar el producto y luego agregarlo con la nueva cantidad
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

  // Eliminar producto del carrito
  async removeProductFromCart(req, res) {
    try {
      const cartId = req.params.id
      const productId = req.params.productId

      // Verificar que el carrito existe
      const cart = await cartModel.findById(cartId)
      if (!cart) {
        return res.status(404).json({
          status: "error",
          message: "Carrito no encontrado",
        })
      }

      // Verificar que el usuario sea el propietario del carrito o admin
      if (req.user.role !== "admin" && cart.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "error",
          message: "Acceso denegado. Solo puedes modificar tu propio carrito",
        })
      }

      // Eliminar producto del carrito
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

  // Vaciar carrito
  async emptyCart(req, res) {
    try {
      const cartId = req.params.id

      // Verificar que el carrito existe
      const cart = await cartModel.findById(cartId)
      if (!cart) {
        return res.status(404).json({
          status: "error",
          message: "Carrito no encontrado",
        })
      }

      // Verificar que el usuario sea el propietario del carrito o admin
      if (req.user.role !== "admin" && cart.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "error",
          message: "Acceso denegado. Solo puedes modificar tu propio carrito",
        })
      }

      // Vaciar carrito
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
