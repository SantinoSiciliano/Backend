class TicketDTO {
    constructor(ticket) {
      this.id = ticket._id
      this.code = ticket.code
      this.purchase_datetime = ticket.purchase_datetime
      this.amount = ticket.amount
      this.purchaser = ticket.purchaser
      this.products = ticket.products
      this.quantity = ticket.quantity
    }
  }
  
  module.exports = {
    TicketDTO,
  }
  
  