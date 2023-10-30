export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function camelize(string: string) {
  return string.replace(/[_.-](\w|$)/g, (_, char) => char.toUpperCase()).replace(/^(.)/, (char) => char.toLowerCase())
}

export function pascalize(string: string) {
  return capitalize(string.replace(/[_.-](\w|$)/g, (_, char) => char.toUpperCase()))
}

export function kebabize(string: string) {
  return string.replace(/[A-Z]+(?![a-z])|[A-Z]|_(?=[A-z])/g, (match, ofs) => {
    if (match === '_') {
      return '-'
    }

    return (ofs ? '-' : '') + match.toLowerCase()
  })
}

export function snakize(string: string) {
  return string.replace(/([A-Z]|-(?=[A-z]))/g, (match, _, index) => {
    if (match === '-') {
      return '_'
    }

    return !index ? match.toLowerCase() : `_${match.toLowerCase()}`
  })
}
