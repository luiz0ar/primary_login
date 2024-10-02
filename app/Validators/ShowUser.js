'use strict'

class ShowUser {
  get rules () {
    return {
      id: 'required|unique:users, id',
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

module.exports = ShowUser
