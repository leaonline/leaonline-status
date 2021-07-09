import { createCollectionFactory } from 'meteor/leaonline:collection-factory'
import { Schema } from '../../../api/schema/Schema'

const collectionFactory = createCollectionFactory({
  schemaFactory: Schema.create
})

export const createCollection = (context, { isLocal } = {}) => {
  const { name } = context

  const localText = isLocal ? '(local)' : ''
  console.debug(`[createCollection]: create ${name} ${localText}`)

  if (isLocal) {
    const options = Object.assign({}, context, { name: null })
    return collectionFactory(options)
  }

  return collectionFactory(context)
}
