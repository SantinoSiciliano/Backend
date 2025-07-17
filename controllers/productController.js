const productService = require("../services/productService")
const { ProductDTO, ProductCreateDTO } = require("../dto/productDTO")

class ProductController {
  async createProduct(req, res) {
    try {
      const productCreateDTO = new ProductCreateDTO(req.body)
      const newProduct = await productService.createProduct(productCreateDTO)
      const productDTO = new ProductDTO(newProduct)

      res.status(201).json({
        status: "success",
        message: "Producto creado exitosamente",
        product: productDTO,
      })
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async getProducts(req, res) {
    try {
      const products = await productService.getAllProducts()
      const productsDTO = products.map((product) => new ProductDTO(product))

      res.json({
        status: "success",
        products: productsDTO,
      })
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.getProductById(req.params.id)
      const productDTO = new ProductDTO(product)

      res.json({
        status: "success",
        product: productDTO,
      })
    } catch (error) {
      res.status(404).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async updateProduct(req, res) {
    try {
      const updatedProduct = await productService.updateProduct(req.params.id, req.body)
      const productDTO = new ProductDTO(updatedProduct)

      res.json({
        status: "success",
        message: "Producto actualizado exitosamente",
        product: productDTO,
      })
    } catch (error) {
      res.status(404).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async deleteProduct(req, res) {
    try {
      const result = await productService.deleteProduct(req.params.id)

      res.json({
        status: "success",
        message: result.message,
      })
    } catch (error) {
      res.status(404).json({
        status: "error",
        message: error.message,
      })
    }
  }
}

module.exports = new ProductController()

