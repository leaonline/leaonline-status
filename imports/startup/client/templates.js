import { Blaze } from 'meteor/blaze'
import 'meteor/leaonline:ui/components/icon/icon'
import 'meteor/leaonline:ui/components/image/image'

/**
 * This is a way to provide a Template-independent way of initializing
 * dependencies like i18n etc. that require a certain loading time.
 * @param language
 * @param contexts
 * @param onComplete
 * @return {Blaze.TemplateInstance}
 */

Blaze.TemplateInstance.prototype.initDependencies =
  function ({ contexts = [], onComplete }) {
    import { createLog } from '../../utils/createLog'
    import { createCollection } from '../../infrastructure/factories/collection/createCollection'

    const instance = this

    // create api to provide a consistent dev experience across all template
    // instances without tight coupling between the api and Template files
    instance.api = {}
    instance.api.info = createLog({
      name: instance.view.name,
      target: console.info
    })

    instance.api.debug = createLog({
      name: instance.view.name,
      target: console.debug
    })

    contexts.forEach(ctx => {
      const collection = createCollection(ctx, { isLocal: true })
      ctx.collection = () => collection
    })

    setTimeout(() => {
      onComplete()
    })

    return instance.api
  }
