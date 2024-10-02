'use strict'

class EsqueceuSenha {
  get rules () {
    return {
      username: 'required'
    }
  }
  get messages () {
    return {
      'username.required': 'Username é obrigatório'
    }
  }
}

module.exports = EsqueceuSenha
