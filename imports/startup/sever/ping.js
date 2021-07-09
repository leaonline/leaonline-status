import { Meteor } from 'meteor/meteor'
import { Ping } from '../../contexts/ping/Ping'
import { createCollection } from '../../infrastructure/factories/collection/createCollection'
import { createMethods } from '../../infrastructure/factories/method/createMethods'
import { rateLimitMethods } from '../../infrastructure/factories/ratelimit/rateLimit'
import { hasTimedOut } from '../../api/apps/hasTimedOut'
import { sendAlertMail } from '../../api/network/sendAlertMail'

const PingCollection = createCollection(Ping)
Ping.collection = () => PingCollection

const methods = Object.values(Ping.methods)
createMethods(methods)
rateLimitMethods(methods)

Meteor.startup(() => {
  import { pingApp } from '../../api/network/pingApp'

  const { ping } = Meteor.settings
  const apps = Object.values(Meteor.settings.public.apps)

  // in case we have a severe timeout, we need to send an Email ONCE!
  // By default on startup there is no email sent yet
  const mailSent = new Map()
  apps.forEach(app => mailSent.set(app.name, false))

  console.debug('[ping]: start pinging every', ping)

  Meteor.setInterval(function () {
    apps.forEach(app => {
      Meteor.defer(function () {
        pingApp(app)
          .catch(error => {
            const errorName = error.toString()
            console.error(errorName)

            checkLast(app, errorName)

            PingCollection.upsert({ app: app.name }, {
              $set: {
                app: app.name,
                ip: app.ip || 'unresolved',
                error: errorName,
                sent: error.sent,
                received: error.received,
                status: error.status,
                duration: error.received - error.sent
              }
            })
          })
          .then(res => {
            const { sent, received, duration, numeric_host: numericHost, alive } = res

            const newDoc = {
              timestamp: new Date(),
              app: app.name,
              ip: numericHost || app.origin,
              sent: sent,
              received: received,
              status: alive ? 'alive' : 'notAlive',
              duration: duration
            }

            if (alive) {
              newDoc.lastAlive = new Date()
              // reset the mailSent flag, since the app may have been restored
              mailSent.set(app.name, false)
            }

            else {
              console.warn('[ping]: not alive!', app.name)
              checkLast(app)
            }

            PingCollection.upsert({ app: app.name }, { $set: newDoc })
          })
      })
    })
  }, ping)

  function checkLast (app, errorName) {
    // if we can't reach the app, we check for the last ping and send
    // an alert mail in case the app is unresponsive for a longer time
    const lastPingDoc = PingCollection.findOne({ app: app.name })

    if (lastPingDoc && !mailSent.get(app.name) && hasTimedOut(lastPingDoc.lastAlive)) {
      sendAlertMail({
        subject: `[${app.name}] is not reachable`,
        text: JSON.stringify({
          app: app.name,
          orign: app.origin,
          host: app.host,
          lastPing: lastPingDoc.timestamp,
          error: errorName
        })
      })
      mailSent.set(app.name, true)
    }
  }
})
