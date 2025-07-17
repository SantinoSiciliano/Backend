class UserDTO {
    constructor(user) {
      this.id = user._id
      this.first_name = user.first_name
      this.last_name = user.last_name
      this.email = user.email
      this.age = user.age
      this.role = user.role
      this.createdAt = user.createdAt
    }
  }
  
  class UserCreateDTO {
    constructor(userData) {
      this.first_name = userData.first_name
      this.last_name = userData.last_name
      this.email = userData.email
      this.age = userData.age
      this.password = userData.password
      this.role = userData.role || "user"
    }
  }
  
  class UserUpdateDTO {
    constructor(userData) {
      if (userData.first_name) this.first_name = userData.first_name
      if (userData.last_name) this.last_name = userData.last_name
      if (userData.email) this.email = userData.email
      if (userData.age) this.age = userData.age
    }
  }
  
  module.exports = {
    UserDTO,
    UserCreateDTO,
    UserUpdateDTO,
  }
  