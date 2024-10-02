'use strict'

const Permission = use('Permission');
const LogError = use('App/Models/LogErrors');


class PermissionController {

  async index({ response }) {
    try {
      const permissions = await Permission.all();
      return response.json(permissions);
    } catch (error) {
      const errorLog = {
        jsonError: JSON.stringify(error),
        controller: "PermissionController",
        function: "index",
        message: error.message
      }

      await LogError.create(errorLog);

      console.error('Ocorreu um erro:', error.message)
      return response.status(404).json({ message: 'Ocorreu um erro, favor acionar a equipe de TI' })
    }
  }

  async show({ params, response }) {
    try {
      const permission = await Permission.findOrFail(params.id);
      return response.json(permission);
    } catch (error) {
      const errorLog = {
        jsonError: JSON.stringify(error),
        controller: "PermissionController",
        function: "show",
        message: error.message
      }

      await LogError.create(errorLog);

      console.error('Ocorreu um erro:', error.message)
      return response.status(404).json({ message: 'Ocorreu um erro, favor acionar a equipe de TI' })
    }
  }

  async store({ request }) {
    try {
      const data = request.only(['name', 'slug', 'description'])
      const permission = Permission.create(data)
      return permission
    } catch (error) {
      const errorLog = {
        jsonError: JSON.stringify(error),
        controller: "PermissionController",
        function: "store",
        message: error.message
      }

      await LogError.create(errorLog);
      console.error('Ocorreu um erro ao criar a permissão:', error.message);

      return response.status(500).json({ message: 'Falha ao criar permissão.', details: error.message });
    }
  }

  async update({ request, params }) {
    try {
      const data = request.only(['name', 'slug', 'description'])

      const permission = await Permission.findOrFail(params.id)

      permission.merge(data)

      await permission.save()

      return permission
    } catch (error) {
      const errorLog = {
        jsonError: JSON.stringify(error),
        controller: "PermissionController",
        function: "update",
        message: error.message
      }

      await LogError.create(errorLog);
      console.error('Ocorreu um erro ao atualizar a permissão:', error.message);

      return response.status(500).json({ message: 'Falha ao atualizar permissão.', details: error.message });
    }
  }


  async destroy({ params, response }) {
    try {
      const permission = await Permission.findOrFail(params.id);

      await permission.delete();

      return response.status(200).json({ message: 'Permissão deletada com sucesso.' });
    } catch (error) {

      const errorLog = {
        jsonError: JSON.stringify(error),
        controller: "PermissionController",
        function: "destroy",
        message: error.message
      }

      await LogError.create(errorLog);
      console.error('Ocorreu um erro ao deletar a permissão:', error.message);

      return response.status(500).json({ message: 'Falha ao deletar permissão.', details: error.message });
    }
  }
}

module.exports = PermissionController
