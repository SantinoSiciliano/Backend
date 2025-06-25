const jwt = require("jsonwebtoken")
const passport = require("passport")
const cartModel = require("../models/cartModel")

class SessionController {
 
  async login(req, res, next) {
    passport.authenticate("local", { session: false }, async (err, user, info) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: err.message,
        })
      }

      if (!user) {
        return res.status(401).json({
          status: "error",
          message: info.message || "Credenciales inválidas",
        })
      }

      try {
        
        let cart = await cartModel.findByUserId(user._id)
        if (!cart) {
          cart = await cartModel.createCart(user._id)
        }

        
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "24h" },
        )

        res.json({
          status: "success",
          message: "Login exitoso",
          token,
          user: {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: cart._id,
          },
        })
      } catch (error) {
        console.error("Error en login:", error)
        res.status(500).json({
          status: "error",
          message: error.message || "Error interno del servidor",
        })
      }
    })(req, res, next)
  }

  
  async current(req, res) {
    try {
      
      const user = req.user

      const cart = await cartModel.findByUserId(user._id)

      res.json({
        status: "success",
        user: {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          age: user.age,
          role: user.role,
          cart: cart || null,
        },
      })
    } catch (error) {
      console.error("Error al obtener usuario actual:", error)
      res.status(500).json({
        status: "error",
        message: error.message || "Error interno del servidor",
      })
    }
  }

  
  async logout(req, res) {
    try {
      
      res.json({
        status: "success",
        message: "Logout exitoso. Elimina el token del cliente.",
      })
    } catch (error) {
      console.error("Error en logout:", error)
      res.status(500).json({
        status: "error",
        message: error.message || "Error interno del servidor",
      })
    }
  }

  async refreshToken(req, res) {
    try {
      const user = req.user

      
      const newToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      )

      res.json({
        status: "success",
        message: "Token renovado exitosamente",
        token: newToken,
      })
    } catch (error) {
      console.error("Error al renovar token:", error)
      res.status(500).json({
        status: "error",
        message: error.message || "Error interno del servidor",
      })
    }
  }
}

module.exports = new SessionController()