'use strict'

class StoreUser {
  get rules () {
    return {
      username: 'required|unique:users, username|min:3|max:30|regex:^[a-zA-Z0-9_]*$',
      email: 'required|email|unique:users, email',
      password: 'required|min:8'
    }
  }

  get messages () {
    return {
      'email.required': 'Campo vázio.',
      'email.email': 'Email ou senha inválidos.',
      'email.unique': 'Email ou senha inválidos.',
      'username.required': 'Campo vázio.',
      'username.unique': 'Usuário já existente.',
      'username.min': 'O nome de usuário deve ter mais de 3 caracteres.',
      'username.max': 'O nome de usuário deve ter menos de 30 caracteres',
      'username.regex': 'O nome de usuário não pode conter caracteres especiais',
      'password.min':'A senha deve ter no mínimo 8 caracteres',
      'password.required': 'Campo vázio.'
    }
  }
   async fails (errorMessages) {
    return this.ctx.response.send(errorMessages)
  }
}

module.exports = StoreUser
