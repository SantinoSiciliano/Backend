const productRepository = require("../repositories/productRepository")

class ProductService {
  async createProduct(productData) {
    return productRepository.createProduct(productData)
  }

  async getAllProducts(filter = {}, options = {}) {
    return productRepository.findAll(filter, options)
  }

  async getProductById(id) {
    const product = await productRepository.findById(id)
    if (!product) {
      throw new Error("Producto no encontrado")
    }
    return product
  }

  async updateProduct(id, productData) {
    const updated = await productRepository.updateProduct(id, productData)
    if (!updated) {
      throw new Error("Producto no encontrado")
    }
    return productRepository.findById(id)
  }

  async deleteProduct(id) {
    const deleted = await productRepository.deleteProduct(id)
    if (!deleted) {
      throw new Error("Producto no encontrado")
    }
    return { message: "Producto eliminado exitosamente" }
  }

  async updateStock(id, newStock) {
    const updated = await productRepository.updateStock(id, newStock)
    if (!updated) {
      throw new Error("Producto no encontrado")
    }
    return productRepository.findById(id)
  }
}

module.exports = new ProductService()

