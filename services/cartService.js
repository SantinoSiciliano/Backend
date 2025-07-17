const cartRepository = require("../repositories/cartRepository")

class CartService {
  async createCart(userId) {
    return cartRepository.createCart(userId)
  }

  async getCartById(id) {
    const cart = await cartRepository.findById(id)
    if (!cart) {
      throw new Error("Carrito no encontrado")
    }
    return cart
  }

  async getCartByUserId(userId) {
    let cart = await cartRepository.findByUserId(userId)
    if (!cart) {
      cart = await cartRepository.createCart(userId)
    }
    return cart
  }

  async addProductToCart(cartId, productId, quantity) {
    const price = 100 
    return cartRepository.addProduct(cartId, productId, quantity, price)
  }

  async removeProductFromCart(cartId, productId) {
    return cartRepository.removeProduct(cartId, productId)
  }

  async clearCart(cartId) {
    return cartRepository.clearCart(cartId)
  }

  async deleteCart(id) {
    return cartRepository.deleteCart(id)
  }
}

module.exports = new CartService()


