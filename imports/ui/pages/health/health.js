import { Template } from 'meteor/templating'
import { Health } from '../../../contexts/Health/Health'
import { Ping } from '../../../contexts/ping/Ping'
import './health.html'

const { apps, interval, timeOut } = Meteor.settings.public
const appValues = Object.values(apps)

Template.health.onCreated(function () {
  const instance = this

  const API = instance.initDependencies({
    contexts: [Health, Ping],
    onComplete () {
      instance.state.set('dependenciesComplete', true)

      const HealthCollection = Health.collection()
      const PingCollection = Ping.collection()

      const loadHealthData = () => {
        instance.state.set('loadingHealth', true)
        instance.state.set('loadingPing', true)

        Meteor.call(Health.methods.latest.name, {}, (err, docs) => {
          docs.forEach(doc => HealthCollection.upsert({ _id: doc._id }, { $set: doc }))
          instance.state.set('loadingHealth', false)
        })

        Meteor.call(Ping.methods.all.name, (err, docs) => {
          docs.forEach(doc => PingCollection.upsert({ _id: doc._id }, { $set: doc }))
          instance.state.set('loadingPing', false)
        })
      }

      loadHealthData()
      instance.interval = setInterval(loadHealthData, interval)
    }
  })
})

Template.health.helpers({
  apps () {
    return appValues
  },
  data (app) {
    return Health.collection().find({ app }, { limit: 1, sort: { createdAt: -1  }}).fetch()[0]
  },
  ping (app) {
    return Ping.collection().findOne({ app })
  },
  loading () {
    return Template.getState('loadingHealth') &&  Template.getState('loadingPing')
  },
  isActive (status) {
    return status === 'alive'
  },
  average (list) {
    return list.reduce((sum, elem) => sum + elem, 0).toFixed(2)
  },
  values(obj) {
    return Object.entries(obj).map(([name, value]) => ({name, value}))
  },
  memory(free, total) {
    return ((free / total) * 100).toFixed(2)
  },
  isTooOld (date) {
    return new Date() - new Date(date) > timeOut
  }
})
