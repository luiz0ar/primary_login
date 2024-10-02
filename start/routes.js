'use strict'

const LoginController = require('../app/Controllers/Http/LoginController')

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('login', 'LoginController.login')


Route.group(() => {
  Route.resource('user', 'LoginController').apiOnly()
    .validator(new Map([
      [['user.store'], ['StoreUser']],
      [['user.update'], ['UpdateUser']],
      [['user.login'], ['LoginUser']]
    ]))

  Route.resource('permission', 'PermissionController').apiOnly()
  .validator(new Map([
    [['permissions.store'], ['StorePermission']],
    [['permissions.update'], ['UpdatePermission']]
  ]))

  Route.resource('role', 'RoleController').apiOnly().validator(new Map([
    [['role.store'], ['StoreRole']],
    [['role.update'], ['UpdateRole']]
  ]))

  Route.post('roleToUser', 'LoginController.roleToUser').validator('RoleToUser')
  Route.post('deleteroleToUser', 'LoginController.deleteroleToUser').validator('DeleteRoleToUser')


  Route.post('permissionRole', 'RoleController.permissionRole').validator('PermissionRole')
  Route.post('deletepermissionRole', 'RoleController.deletepermissionRole').validator('DeletePermissionRole')
  
  Route.post('permissionUser', 'LoginController.permissionUser').validator('PermissionUser')
  Route.post('deletePermissionUser', 'LoginController.deletePermissionUser').validator('DeletePermissionUser')

  Route.get('forgot', 'LoginController.forgot').validator('Forgot')
  Route.get('reset/:token', 'LoginController.reset').validator('Reset')

  Route.post('addError/:id', 'LogErrorController.addError')

}).middleware(['auth'])