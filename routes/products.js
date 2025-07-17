const express = require("express")
const router = express.Router()
const productController = require("../controllers/productController")
const { authenticateJWT, requireAdmin } = require("../middlewares/auth")


router.get("/", productController.getProducts)
router.get("/:id", productController.getProductById)

router.post("/", authenticateJWT, requireAdmin, productController.createProduct)
router.put("/:id", authenticateJWT, requireAdmin, productController.updateProduct)
router.delete("/:id", authenticateJWT, requireAdmin, productController.deleteProduct)

module.exports = router

