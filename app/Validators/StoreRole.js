'use strict'

class StoreRole {
  get rules () {
    return {
      name: 'required|unique:roles, name',
      slug: 'unique:roles, slug'
    }
  }

  get messages () {
    return {
      'name.required': 'Campo vázio.',
      'name.unique': 'Role já existe.',
      'slug.unique': 'Slug já existe.',
      'permission.required': 'Campo vázio'
    }
  }
   async fails (errorMessages) {
    return this.ctx.response.send(errorMessages)
  }
}

module.exports = StoreRole
