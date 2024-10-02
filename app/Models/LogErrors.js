'use strict'

const Model = use('Model')

class LogErrors extends Model {
  static get table() {
    return 'log_errors'
  }
}

module.exports = LogErrors
