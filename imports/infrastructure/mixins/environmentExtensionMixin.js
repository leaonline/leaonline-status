import { createLog } from '../../utils/createLog'

/**
 * This mixin injects useful generic functions into the method or publication
 * environment (the funciton's this-context).
 *
 * @param options
 * @return {*}
 */
export const environmentExtensionMixin = function (options) {
  const { env } = options
  if (env === null || env === false) return options

  const envOptions = env || {}
  const { devOnly } = envOptions
  const skip = devOnly &&  !Meteor.isDevelopment
  const info =  skip
    ? (() => {})
    : createLog({ name: options.name, target: console.info })
  const debug = skip
    ? (() => {})
    : createLog({ name: options.name, target: console.debug })

  const runFct = options.run

  options.run = function run (...args) {
    // safe-assign our extensions to the environment document
    Object.assign(this, { info, debug })

    debug('called')
    return runFct.call(this, ...args)
  }

  return options
}
