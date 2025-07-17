const ticketDAO = require("../dao/ticketDAO")
const { v4: uuidv4 } = require("uuid")

class TicketRepository {
  async createTicket(ticketData) {
    const newTicket = {
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount: ticketData.amount,
      purchaser: ticketData.purchaser,
      products: ticketData.products,
      quantity: ticketData.quantity,
    }
    return ticketDAO.create(newTicket)
  }

  async findById(id) {
    return ticketDAO.findById(id)
  }

  async findByCode(code) {
    return ticketDAO.findByCode(code)
  }

  async findByUserId(userId) {
    return ticketDAO.findByUserId(userId)
  }

  async findAll() {
    return ticketDAO.findAll()
  }
}

module.exports = new TicketRepository()

