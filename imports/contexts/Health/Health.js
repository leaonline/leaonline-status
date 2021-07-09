import { onServerExec } from '../../utils/arch'
import { Meteor } from "meteor/meteor"

export const Health = {
  name: 'health',
  icon: "health",
  label: 'health.title'
}

Health.schema = {
  app: String,
  origin: String,
  createdAt: {
    type: Date,
    optional: true
  },
  sessions: Number,
  subs: {
    type: Object,
    blackbox: true
  },
  osuptime: Number,
  osload: Array,
  'osload.$': Number,
  osfreemem: Number,
  ostotalmem: Number
}

Health.methods = {}

Health.methods.latest = {
  name: 'health.methods.latest',
  validate () {},
  run: onServerExec(function () {
    const hint = { $natural: - 1 }
    const { limit } = Meteor.settings.health

    return function () {
      return Health.collection().find({}, { limit, hint }).fetch()
    }
  })
}

Health.publications = {}

Health.publications.monitor = {
  name: 'health.publications.monitor',
  validate () {},
  run: onServerExec(function () {
    const hint = { $natural: -1 }
    const { limit } = Meteor.settings.health

    return function () {
      return Health.collection().find({}, { limit, hint }).fetch()
    }
  })
}

Health.routes = {}

Health.routes.collection = {
  path: '/collect',
  method: 'post',
  validate: onServerExec(function () {
    import { Schema } from '../../api/schema/Schema'
    import { createHmac } from 'crypto'

    const { secret, phrase } = Meteor.settings.health
    const { app, createdAt, ...healthSchema } = Health.schema
    const schema = Schema.create({
      ...healthSchema,
      hash: String
    })

    return function (data) {
      schema.validate(data)

      const expectedHash = createHmac('sha256', secret)
        .update(data.origin, 'utf8')
        .digest('hex')

      if (data.hash !== expectedHash) {
        throw new Error('Hash denied, secret is wrong!')
      }
    }
  }),
  run: onServerExec(function () {
    import { getAppByOrigin } from '../../api/apps/getAppByOrigin'

    return function (req) {
      const createdAt = new Date()
      const origin = req.headers.origin
      const app = getAppByOrigin(origin)
      if (!app) throw new Error(`No app nby origin ${origin}`)

      const data = this.data()

      return Health.collection().insert({ createdAt, app: app.name, ...data, origin })
    }
  })
}
