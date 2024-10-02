'use strict'

class LoginUser {
  get rules () {
    return {
      username: 'required|unique:users, username|min:3|max:30|regex:^[a-zA-Z0-9_]*$',
      password: 'required|min:8'
    }
  }

  get messages () {
    return {
      'username.required': 'Campo vázio',
      'username.unique': 'Usuário ou senha inválidos.',
      'password.required': 'Campo vázio',
      'password.min':'A senha deve ter no mínimo 8 caracteres'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(errorMessages)
  }
}

module.exports = LoginUser
