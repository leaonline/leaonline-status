import { Health } from '../../contexts/Health/Health'
import { createCollection } from '../../infrastructure/factories/collection/createCollection'
import { createMethods } from '../../infrastructure/factories/method/createMethods'
import { rateLimitMethods } from '../../infrastructure/factories/ratelimit/rateLimit'
import { createRoutes } from '../../infrastructure/factories/routes/createRoute'

const collection = createCollection(Health)
Health.collection = () => collection

const methods = Object.values(Health.methods)
createMethods(methods)
rateLimitMethods(methods)

const routes = Object.values(Health.routes)
createRoutes(routes)
