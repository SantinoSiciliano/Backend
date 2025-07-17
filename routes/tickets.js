const express = require("express")
const router = express.Router()
const ticketController = require("../controllers/ticketController")
const { authenticateJWT, requireAdmin } = require("../middlewares/auth")


router.use(authenticateJWT)


router.post("/checkout", ticketController.checkout)


router.get("/my-tickets", ticketController.getUserTickets)


router.get("/:id", ticketController.getTicketById)


router.get("/code/:code", ticketController.getTicketByCode)


router.get("/", requireAdmin, ticketController.getAllTickets)

module.exports = router
