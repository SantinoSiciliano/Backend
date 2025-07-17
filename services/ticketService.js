const ticketRepository = require("../repositories/ticketRepository")
const cartService = require("./cartService")
const productService = require("./productService")

class TicketService {
  async createTicket(userId, cartId) {
    const cart = await cartService.getCartById(cartId)

    if (!cart.products || cart.products.length === 0) {
      throw new Error("El carrito está vacío")
    }

    let totalAmount = 0
    let totalQuantity = 0
    const ticketProducts = []

    
    for (const cartProduct of cart.products) {
      const product = await productService.getProductById(cartProduct.productId)

      if (product.stock >= cartProduct.quantity) {
        
        await productService.updateStock(product._id, product.stock - cartProduct.quantity)

        
        const productTotal = cartProduct.price * cartProduct.quantity
        totalAmount += productTotal
        totalQuantity += cartProduct.quantity

        ticketProducts.push({
          productId: cartProduct.productId,
          title: product.title, 
          price: cartProduct.price,
          quantity: cartProduct.quantity,
          total: productTotal,
        })
      }
    }

    if (ticketProducts.length === 0) {
      throw new Error("No hay productos con stock suficiente para generar un ticket.")
    }

    
    const ticketData = {
      amount: totalAmount,
      purchaser: userId,
      products: ticketProducts,
      quantity: totalQuantity,
    }

    const ticket = await ticketRepository.createTicket(ticketData)

    
    await cartService.clearCart(cartId)

    return ticket
  }

  async getTicketById(id) {
    const ticket = await ticketRepository.findById(id)
    if (!ticket) {
      throw new Error("Ticket no encontrado")
    }
    return ticket
  }

  async getTicketByCode(code) {
    const ticket = await ticketRepository.findByCode(code)
    if (!ticket) {
      throw new Error("Ticket no encontrado")
    }
    return ticket
  }

  async getTicketsByUserId(userId) {
    return ticketRepository.findByUserId(userId)
  }

  async getAllTickets() {
    return ticketRepository.findAll()
  }
}

module.exports = new TicketService()

