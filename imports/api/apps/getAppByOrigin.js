import { Meteor } from 'meteor/meteor'

const origins = new Map()

Object.values(Meteor.settings.public.apps).forEach(app => {
  origins.set(app.origin, app)
})

export const getAppByOrigin = origin => {
  const o = origins.get(origin)

  if (o) return o

  return origins.get(`${origin}/`)
}
