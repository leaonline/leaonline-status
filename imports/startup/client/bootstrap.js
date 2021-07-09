import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'

Meteor.startup(() => {
  setTimeout(async () => {
    const popper = (await import('popper.js')).default
    global.Popper = global.Popper || popper
  }, 1000)

  setTimeout(async () => {
    await import('bootstrap')
    await import('./theme.scss')
  }, 300)
})
