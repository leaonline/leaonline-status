export const createLog = ({ name, target = console.log }) => {
  const logName = `[${name}]:`
  return (...args) => {
    args.unshift(logName)
    return target.apply(null, args)
  }
}
