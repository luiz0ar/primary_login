
'use strict'

const Role = use('Role');
const Permission = use('Permission');
const LogError = use('App/Models/LogErrors');

class RoleController {

  async index() {
    try {
      const roles = await Role.query().with('permissions').fetch()
      return roles
    } catch (error) {

      const errorLog = {
        jsonError: JSON.stringify(error),
        controller: "RoleController",
        function: "index",
        message: error.message
      }

      await LogError.create(errorLog);
      return { error: 'Falha ao encontrar roles', details: error.message }
    }
  }

  async show({ params }) {
    try {
      const role = await Role.findOrFail(params.id)
      await role.load('permissions')
      return role
    } catch (error) {

      const errorLog = {
        jsonError: JSON.stringify(error),
        controller: "RoleController",
        function: "show",
        message: error.message
      }

      await LogError.create(errorLog);
      return { error: 'Role não econtrada', details: error.message }
    }
  }

  async store({ request }) {
    try {
      const { permissions, ...data } = request.only(['name', 'slug', 'description', 'permission'])
      const role = await Role.create(data)

      if (permissions) {
        await role.permissions().attach(permissions)
      }

      await role.load('permissions')
      return role
    } catch (error) {

      const errorLog = {
        jsonError: JSON.stringify(error),
        controller: "RoleController",
        function: "store",
        message: error.message
      }

      await LogError.create(errorLog);
      return { error: 'Falha ao criar role', details: error.message }
    }
  }

  async update({ request, params }) {
    try {
      const { permissions, ...data } = request.only(['name', 'slug', 'description', 'permission'])
      const role = await Role.findOrFail(params.id)

      role.merge(data)
      await role.save()

      if (permissions) {
        await role.permissions().sync(permissions)
      }

      await role.load('permission')
      return role
    } catch (error) {

      const errorLog = {
        jsonError: JSON.stringify(error),
        controller: "RoleController",
        function: "update",
        message: error.message
      }

      await LogError.create(errorLog);
      return { error: 'Falha ao atualizar role', details: error.message }
    }
  }

  async destroy({ params, response }) {
    try {
      const role = await Role.findOrFail(params.id)
      await role.delete()
      return response.status(200).json({ message: 'Role deletada com sucesso.' })
    } catch (error) {
      console.error('Ocorreu um erro:', error.message)
      return response.status(500).json({ message: 'Falha ao deletar a role.', details: error.message })
    }
  }

  async permissionRole({ response, request }) {
    try {
      const { role, permission } = request.all()

      const roleAdmin = await Role.find(role)
      await roleAdmin.permissions().attach(permission)

      return response.status(200).json({ message: 'Permissão adicionada ao cargo.' })
    } catch {
      const errorLog = {
        jsonError: JSON.stringify(error),
        controller: "RoleController",
        function: "permissionRole",
        message: error.message
      }

      await LogError.create(errorLog);
      return { error: 'Role não econtrada', details: error.message }
    }
  }

  async deletepermissionRole({ response, request }) {
    try {
      const { role, permission } = request.all()

      const roleAdmin = await Role.find(role)
      await roleAdmin.permissions().detach(permission)

      return response.status(200).json({ message: 'Permissão removida do cargo.' })
    } catch {
      const errorLog = {
        jsonError: JSON.stringify(error),
        controller: "RoleController",
        function: "deletepermissionRole",
        message: error.message
      }

      await LogError.create(errorLog);
      return { error: 'Role não econtrada', details: error.message }
    }
  }
}

module.exports = RoleController
