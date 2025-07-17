class ProductDTO {
    constructor(product) {
      this.id = product._id
      this.title = product.title
      this.description = product.description
      this.price = product.price
      this.stock = product.stock
      this.category = product.category
      this.thumbnails = product.thumbnails || []
      this.createdAt = product.createdAt
      this.updatedAt = product.updatedAt
    }
  }
  
  class ProductCreateDTO {
    constructor(productData) {
      this.title = productData.title
      this.description = productData.description
      this.price = productData.price
      this.stock = productData.stock
      this.category = productData.category
      this.thumbnails = productData.thumbnails || []
    }
  }
  
  module.exports = {
    ProductDTO,
    ProductCreateDTO,
  }
  
  