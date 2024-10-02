'use strict'

const LogError = use('App/Models/LogErrors')

class LogErrorController {
  async addError({ params, request }) {
    try {
      const { solutioned_at } = request.only(['solutioned_at']);

      const errorLog = await LogError.find(params.id);
      
      if (!errorLog) {
        return { error: 'erro não registrado' };
      }
      
      errorLog.merge({ solutioned_at });
      await errorLog.save();
      
      return errorLog;
    } catch (error) {
      console.error('Erro ao adicionar erro:', error);

      return { error: 'Ocorreu um erro ao processar a solicitação' };
    }
  }
}

module.exports = LogErrorController;
