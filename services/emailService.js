const nodemailer = require("nodemailer")

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number.parseInt(process.env.EMAIL_PORT, 10), 
      secure: process.env.EMAIL_PORT == 465, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }

  async sendPasswordResetEmail(to, resetUrl) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: "Recuperación de Contraseña - Ecommerce",
      html: `
        <h2>Recuperación de Contraseña</h2>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
      `,
    }

    return this.transporter.sendMail(mailOptions)
  }

  async sendPurchaseConfirmation(to, ticket) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: `Confirmación de Compra - Ticket ${ticket.code}`,
      html: `
        <h2>¡Gracias por tu compra!</h2>
        <p><strong>Código de Ticket:</strong> ${ticket.code}</p>
        <p><strong>Fecha:</strong> ${ticket.purchase_datetime}</p>
        <p><strong>Total:</strong> $${ticket.amount}</p>
        <p><strong>Cantidad de productos:</strong> ${ticket.quantity}</p>
        
        <h3>Productos:</h3>
        <ul>
          ${ticket.products
            .map(
              (product) => `
            <li>${product.title} - Cantidad: ${product.quantity} - Precio: $${product.price} - Total: $${product.total}</li>
          `,
            )
            .join("")}
        </ul>
      `,
    }

    return this.transporter.sendMail(mailOptions)
  }
}

module.exports = new EmailService()


