import { DefaultOrEmptyValue, DefaultValue, DsSize, DState } from '@/_common/type'

type ComponentDetailResult = { classes: string[] } & Partial<Record<DefaultValue | DState | DsSize, boolean>>
type ComponentDetailOptions = {
  state?: DefaultOrEmptyValue | DState
  size?: DefaultOrEmptyValue | DsSize
  modes?: (string | Record<string, boolean>)[]
}

const getClassName = (className: string, modifier: string) => `${className}--${modifier}`

/** Формируем карту свойств & классы для компонента
 * @example Если в `options` передать:
 * { state: 'loading', mode: ['primary', { thin: true }] }
 * @example Метод вернёт:
 * { classes: ['component--loading', 'component--primary', 'component--thin'], loading: true } */
export const getComponentDetail = (className: string, options?: ComponentDetailOptions) => {
  const result: ComponentDetailResult = { classes: [] }

  if (!options) {
    return result
  }

  ;(['state', 'size'] as const).forEach((key) => {
    if (options[key] && options[key] !== 'default') {
      result[options[key] as DState] = true
      result.classes.push(getClassName(className, options[key] as DState))
    }
  })

  if (options.modes) {
    options.modes.forEach((mode) => {
      if (typeof mode === 'string') {
        result.classes.push(getClassName(className, mode))
        return
      }

      for (const key in mode) {
        if (mode[key]) {
          result.classes.push(getClassName(className, key))
        }
      }
    })
  }

  return result
}
