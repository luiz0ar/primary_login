'use strict'

class ShowPermission {
  get rules () {
    return {
      id: 'required|unique:permissions, id'
    }
  }

  get messages () {
    return {
      'id.required': 'Erro',
      'id.unique': 'Erro'
    }
}

async fails (errorMessages) {
  return this.ctx.response.send(errorMessages)
}
}

module.exports = ShowPermission
