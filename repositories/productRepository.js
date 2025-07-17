const productDAO = require("../dao/productDAO")

class ProductRepository {
  async createProduct(productData) {
    const newProduct = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return productDAO.create(newProduct)
  }

  async findById(id) {
    return productDAO.findById(id)
  }

  async findAll(filter = {}, options = {}) {
    return productDAO.findAll(filter, options)
  }

  async updateProduct(id, productData) {
    const updateData = {
      ...productData,
      updatedAt: new Date(),
    }
    return productDAO.update(id, updateData)
  }

  async deleteProduct(id) {
    return productDAO.delete(id)
  }

  async updateStock(id, newStock) {
    return productDAO.updateStock(id, newStock)
  }
}

module.exports = new ProductRepository()

