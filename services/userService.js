const userRepository = require("../repositories/userRepository")
const cartService = require("./cartService") 
const emailService = require("./emailService")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

class UserService {
  async createUser(userData) {
    
    const existingUser = await userRepository.findByEmail(userData.email)
    if (existingUser) {
      throw new Error("El usuario ya existe")
    }

    
    const newUser = await userRepository.createUser(userData)

   
    await cartService.createCart(newUser._id)

    return newUser
  }

  async getAllUsers() {
    return userRepository.findAll()
  }

  async getUserById(id) {
    const user = await userRepository.findById(id)
    if (!user) {
      throw new Error("Usuario no encontrado")
    }
    return user
  }

  async updateUser(id, userData) {
    const updated = await userRepository.updateUser(id, userData)
    if (!updated) {
      throw new Error("Usuario no encontrado")
    }
    return userRepository.findById(id)
  }

  async deleteUser(id) {
    const user = await userRepository.findById(id)
    if (!user) {
      throw new Error("Usuario no encontrado")
    }

    const userCart = await cartService.getCartByUserId(user._id)
    if (userCart) {
      await cartService.deleteCart(userCart._id)
    }

    return userRepository.deleteUser(id)
  }

  async authenticateUser(email, password) {
    const user = await userRepository.findByEmail(email)
    if (!user) {
      throw new Error("Credenciales inválidas")
    }

    const isPasswordValid = await userRepository.comparePassword(password, user.password)
    if (!isPasswordValid) {
      throw new Error("Credenciales inválidas")
    }

    return user
  }

  async generateJWT(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    )
  }

  async requestPasswordReset(email) {
    const user = await userRepository.findByEmail(email)
    if (!user) {
      throw new Error("Usuario no encontrado")
    }

    
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetExpires = new Date(Date.now() + 3600000) 

    await userRepository.setResetToken(user._id, resetToken, resetExpires)

    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    await emailService.sendPasswordResetEmail(user.email, resetUrl)

    return { message: "Email de recuperación enviado" }
  }

  async resetPassword(token, newPassword) {
    const user = await userRepository.findByResetToken(token)
    if (!user) {
      throw new Error("Token inválido o expirado")
    }

    await userRepository.updatePassword(user._id, newPassword)
    return { message: "Contraseña actualizada exitosamente" }
  }
}

module.exports = new UserService()

