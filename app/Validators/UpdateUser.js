'use strict'

class UpdateUser {
  get rules () {
    return {
      username: 'unique:users, username|min:3|max:30|regex:^[a-zA-Z0-9_]*$',
      email: 'email|unique:users, email',
      password: 'min:8',
      role: 'integer',
      permission: 'array',
      'permission.*': 'integer'

    }
  }

  get messages () {
    return {
      'email.required': 'Campo vázio.',
      'email.email': 'Email ou usuário inválido.',
      'email.unique': 'Email ou usuário inválido.',
      'username.required': 'Campo vázio',
      'username.unique': 'Email ou usuário inválido.',
      'username.min': 'O nome de usuário deve ter mais de 3 caracteres.',
      'username.max': 'O nome de usuário deve ter menos de 30 caracteres',
      'username.regex': 'Email ou usuário inválido.',
      'password.min': 'A senha deve ter no mínimo 8 caracteres',
      'role.required': 'Error id obrigatório.',
      'role.integer': 'Erro: id int.',
      'permission.required': 'Erro: perm obrigatória.',
      'permission.array': 'Erro: perm array.',
      'permission.*.integer': 'Cada elemento do array de permissões deve ser um número inteiro.',
      'permission.*.exists': 'Erro: perm inexistente.'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(errorMessages)
  }
}

module.exports = UpdateUser
