import SimpleSchema from 'simpl-schema'
import { isomorph } from '../../utils/arch'

export const Schema = {}

Schema.provider = SimpleSchema

Schema.create = isomorph({
  onServer: function () {
    return function (schemaDefinition, options) {
      return new SimpleSchema(schemaDefinition, options)
    }
  },
  onClient: function () {
    const { Tracker } = require('meteor/tracker')

    return function (schemaDefinition, options) {
      return new SimpleSchema(schemaDefinition, Object.assign({ tracker: Tracker }, options))
    }
  }
})
