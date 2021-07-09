import { Meteor } from 'meteor/meteor'
import { Email } from 'meteor/email'

const { to, from } = Meteor.settings

export const sendAlertMail = ({ subject, text }) => Email.send({
  to,
  from,
  subject,
  text
})
