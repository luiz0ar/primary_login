'use strict'

class DeleteRoleToUser {
  get rules () {
    return {
      id: 'required|integer:users, id' ,
      role: 'required|array',
      'role.*': 'integer'
    }
  }

  get messages () {
    return {
      'role.required': 'Erro: role obrigatória.',
      'role.array': 'Erro: role array.',
      'role.*.integer': 'Cada elemento do array de roles deve ser um número inteiro.',
      'id.required': 'Erro: usário obrigatório.',
      'id.integer': 'Erro: id inválido.'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(errorMessages)
  }
}

module.exports = DeleteRoleToUser
