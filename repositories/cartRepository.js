const cartDAO = require("../dao/cartDAO")

class CartRepository {
  async createCart(userId) {
    const cartData = {
      userId,
      products: [],
      createdAt: new Date(),
    }
    return cartDAO.create(cartData)
  }

  async findById(id) {
    return cartDAO.findById(id)
  }

  async findByUserId(userId) {
    return cartDAO.findByUserId(userId)
  }

  async addProduct(cartId, productId, quantity, price) {
    const cart = await cartDAO.findById(cartId)
    const existingProductIndex = cart.products.findIndex((p) => p.productId.toString() === productId)

    if (existingProductIndex > -1) {
      
      cart.products[existingProductIndex].quantity += quantity
      return cartDAO.update(cartId, { products: cart.products })
    } else {
      
      const productData = {
        productId,
        quantity,
        price,
      }
      return cartDAO.addProduct(cartId, productData)
    }
  }

  async removeProduct(cartId, productId) {
    return cartDAO.removeProduct(cartId, productId)
  }

  async clearCart(cartId) {
    return cartDAO.clearProducts(cartId)
  }

  async deleteCart(id) {
    return cartDAO.delete(id)
  }
}

module.exports = new CartRepository()

