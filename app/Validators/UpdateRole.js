'use strict'

class UpdateRole {
  get rules () {
    return {
      'name': 'unique',
      'slug': 'unique'
    }
  }

  get message () {
    return {
      'name.unique':'Nome já existe.',
      'slug.unique':'Slug já existe.'
    }
  }
  async fails (errorMessages) {
    return this.ctx.response.send(errorMessages)
  }
}

module.exports = UpdateRole
