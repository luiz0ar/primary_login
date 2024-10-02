'use strict'

class StorePermission {
  get rules () {
    return {
        name: 'required|unique: permissions, name'
      }
    }

    get messages () {
      return {
        'name.required': 'Campo vázio.'
      }
    }
    async fails (errorMessages) {
      return this.ctx.response.send(errorMessages)
    }
  }

module.exports = StorePermission
