'use strict'

class PermissionUser {
  get rules () {
    return {
      id: 'required|integer',
      permission: 'required|array',
      'permission.*': 'integer' 
    }
  }

  get messages () {
    return {
      'id.required': 'Error role obrigatório.',
      'id.integer': 'Erro: role int.',
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

module.exports = PermissionUser
