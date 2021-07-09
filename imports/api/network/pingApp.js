import ping from 'ping'

export const pingApp = async ({ host }) => {
  const sent = new Date()
  console.debug('[ping]:', host)
  try {
    const pingResponse = await ping.promise.probe(host, { timeout: 10 })
    const received = new Date()
    const duration = received - sent
    console.debug('[ping]:', host, duration, pingResponse.alive)
    return {
      sent, received, duration, ...pingResponse
    }
  } catch (e) {
    e.sent = sent
    e.received = new Date()
    e.duration = e.received - sent
    throw e
  }
}
