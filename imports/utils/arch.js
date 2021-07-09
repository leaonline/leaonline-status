import { Meteor } from "meteor/meteor"

export const onServerExec = fct => Meteor.isServer ? fct() : undefined

export const isomorph = obj => {
  if (Meteor.isServer && obj.onServer) return obj.onServer()
  if (Meteor.isClient && obj.onClient) return obj.onClient()
}
