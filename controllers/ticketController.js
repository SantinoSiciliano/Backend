const ticketService = require("../services/ticketService")
const emailService = require("../services/emailService")
const { TicketDTO } = require("../dto/ticketDTO")

class TicketController {
  async checkout(req, res) {
    try {
      const userId = req.user._id 
      const { cartId } = req.body

      const ticket = await ticketService.createTicket(userId, cartId)
      const ticketDTO = new TicketDTO(ticket)

      
      try {
        await emailService.sendPurchaseConfirmation(req.user.email, ticket)
      } catch (emailError) {
        console.error("Error enviando email de confirmación:", emailError)
      }

      res.status(201).json({
        status: "success",
        message: "Compra realizada exitosamente",
        ticket: ticketDTO,
      })
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async getTicketById(req, res) {
    try {
      const ticket = await ticketService.getTicketById(req.params.id)
      const ticketDTO = new TicketDTO(ticket)

      res.json({
        status: "success",
        ticket: ticketDTO,
      })
    } catch (error) {
      res.status(404).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async getTicketByCode(req, res) {
    try {
      const ticket = await ticketService.getTicketByCode(req.params.code)
      const ticketDTO = new TicketDTO(ticket)

      res.json({
        status: "success",
        ticket: ticketDTO,
      })
    } catch (error) {
      res.status(404).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async getUserTickets(req, res) {
    try {
      const userId = req.user._id 
      const tickets = await ticketService.getTicketsByUserId(userId)
      const ticketsDTO = tickets.map((ticket) => new TicketDTO(ticket))

      res.json({
        status: "success",
        tickets: ticketsDTO,
      })
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async getAllTickets(req, res) {
    try {
      const tickets = await ticketService.getAllTickets()
      const ticketsDTO = tickets.map((ticket) => new TicketDTO(ticket))

      res.json({
        status: "success",
        tickets: ticketsDTO,
      })
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      })
    }
  }
}

module.exports = new TicketController()
