const userService = require("../services/userService")
const cartService = require("../services/cartService")
const { UserDTO } = require("../dto/userDTO")

class SessionController {
  async login(req, res) {
    try {
      const { email, password } = req.body

      const user = await userService.authenticateUser(email, password)
      const token = await userService.generateJWT(user)

      
      const cart = await cartService.getCartByUserId(user._id)

      const userDTO = new UserDTO(user)

      
      res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }) 

      res.json({
        status: "success",
        message: "Login exitoso",
        token, 
        user: {
          ...userDTO,
          cart: cart || null, 
        },
      })
    } catch (error) {
      res.status(401).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async current(req, res) {
    try {
      const user = req.user
      const cart = await cartService.getCartByUserId(user._id)
      const userDTO = new UserDTO(user)

      res.json({
        status: "success",
        user: {
          ...userDTO,
          cart: cart || null,
        },
      })
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      })
    }
  }

  async logout(req, res) {
    
    res.clearCookie("token")

    res.json({
      status: "success",
      message: "Logout exitoso",
    })
  }
}

module.exports = new SessionController()




