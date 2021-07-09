import { createMethodFactory } from 'meteor/leaonline:method-factory'
import { Schema } from '../../../api/schema/Schema'
import { environmentExtensionMixin } from '../../mixins/environmentExtensionMixin'

export const createMethod = createMethodFactory({
  schemaFactory: Schema.create,
  mixins: [environmentExtensionMixin]
})

export const createMethods = methods => methods.forEach(methodDef => {
  console.info(`[methodFactory]: create ${methodDef.name}`)
  createMethod(methodDef)
})
