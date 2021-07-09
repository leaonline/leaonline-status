import { Meteor } from 'meteor/meteor'
import { createHTTPFactory } from 'meteor/leaonline:http-factory'
import { Schema } from '../../../api/schema/Schema'
import cors from 'cors'
import { WebApp } from 'meteor/webapp'
import bodyParser from 'body-parser'

WebApp.connectHandlers.urlEncoded(bodyParser)
WebApp.connectHandlers.json(bodyParser)

const allowedOrigins = Object
  .values(Meteor.settings.public.apps)
  .map(host => host.origin)
console.log('[HTTP]: allowed origins', allowedOrigins)

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true)
      // return callback(new Error(`${origin} is not allowed by CORS`))
    }

    if (allowedOrigins.some(allowed => origin.includes(allowed))) {
      return callback(null, true)
    }

    else {
      return callback(new Error(`${origin} is not allowed by CORS`))
    }
  }
}

export const createRoute = createHTTPFactory({
  schemaFactory: Schema.create,
  cors: cors(corsOptions),
  debug: function (req, res, next) {
    console.debug(req.method, req.url, req.headers.origin)
    next()
  }
})

export const createRoutes = routes => routes.forEach(route => {
  console.debug('[createRoute]: ', route.path)
  return createRoute(route)
})
