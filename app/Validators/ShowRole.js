'use strict'

class ShowRole {
  get rules () {
    return {
      id: 'required|unique:roles, id',
    }
  }

  get messages () {
    return {
      'id.required': 'Erro',
      'id.unique': 'Erro',
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(errorMessages)
  }
}

module.exports = ShowRole
