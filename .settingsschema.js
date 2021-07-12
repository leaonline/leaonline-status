const SimpleSchema = require('simpl-schema')
const schema = def => new SimpleSchema(def)

const settingsSchema = schema({

})

module.exports = function (settings) {
  settingsSchema.validate(settings)
}
