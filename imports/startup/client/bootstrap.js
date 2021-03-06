import { Meteor } from 'meteor/meteor'

Meteor.startup(() => {
  setTimeout(async () => {
    const popper = (await import('@popperjs/core')).default
    global.Popper = global.Popper || popper
  }, 1000)

  setTimeout(async () => {
    await import('bootstrap')
    await import('./theme.scss')
  }, 300)
})
