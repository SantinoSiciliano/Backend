const userDAO = require("../dao/userDAO")
const bcrypt = require("bcrypt")

class UserRepository {
  async createUser(userData) {
    
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    const newUser = {
      ...userData,
      password: hashedPassword,
      role: userData.role || "user",
      createdAt: new Date(),
    }

    return userDAO.create(newUser)
  }

  async findByEmail(email) {
    return userDAO.findByEmail(email)
  }

  async findById(id) {
    return userDAO.findById(id)
  }

  async findAll() {
    return userDAO.findAll()
  }

  async updateUser(id, userData) {
    return userDAO.update(id, userData)
  }

  async deleteUser(id) {
    return userDAO.delete(id)
  }

  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword)
  }

  async setResetToken(userId, token, expires) {
    return userDAO.update(userId, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    })
  }

  async findByResetToken(token) {
    return userDAO.findByResetToken(token)
  }

  async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    return userDAO.update(userId, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    })
  }
}

module.exports = new UserRepository()
