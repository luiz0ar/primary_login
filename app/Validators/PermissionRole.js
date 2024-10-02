'use strict'

class PermissionRole {
  get rules () {
    return {
      role: 'required|integer',
      permission: 'required|array',
      'permission.*': 'integer' 
    }
  }

  get messages () {
    return {
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

module.exports = PermissionRole
