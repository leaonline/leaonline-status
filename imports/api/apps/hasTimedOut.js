const { timeOut } = Meteor.settings.public

export const hasTimedOut = timestamp => {
  const now = new Date()
  return now - timestamp > timeOut
}
