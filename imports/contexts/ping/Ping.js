import { onServerExec } from '../../utils/arch'

export const Ping = {
  name: 'ping',
  icon: 'network-wired',
  label: 'ping.title'
}

Ping.schema = {
  timestamp: Date,
  lastAlive: {
    type: Date,
    optional: true
  },
  app: String,
  ip: String,
  error: {
    type: String,
    optional: true
  },
  status: {
    type: String
  },
  raw: {
    type: String,
    optional: true
  },
  sent: Date,
  received: Date,
  duration: Number
}

Ping.methods = {}

Ping.methods.all = {
  name: 'ping.methods.all',
  schema: {},
  run: onServerExec(function () {

    return function () {
      // TODO restrict by app names in settings.json listed
      return Ping.collection().find().fetch()
    }
  })
}