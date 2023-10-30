import { EffectType } from 'figma-api/lib/ast-types'
import { getPixelValue } from '@/parser/utils'
import { StyleToken } from '@/parser/types'
import Token, { TokenOptions } from '@/parser/tokens/token'
import ColorConverter from '@/parser/converters/colorConverter'

export default class ShadowToken<NType extends 'RECTANGLE'> extends Token<NType> implements StyleToken {
  constructor(options: TokenOptions<NType>) {
    super(options)
  }

  public getStyleProperties() {
    return {
      'box-shadow': this.getShadowValue(),
    }
  }

  private getShadowValue() {
    return (
      this.node.effects
        ?.filter((effect) => effect.visible && effect.color)
        .map((effect) => {
          const result = [
            getPixelValue(effect.offset?.x), // Горизонтальное смещение
            getPixelValue(effect.offset?.y), // Вертикальное смещение
            getPixelValue(effect.radius), // Размытие
            getPixelValue(effect.spread), // Растяжение
            effect.color ? ColorConverter.getStyleColorValue(effect.color) : '', // Цвет тени
          ]

          // ↓↓↓ Если тень внутренняя
          if (effect.type === EffectType.INNER_SHADOW) {
            result.push('inset')
          }

          return result.join(' ')
        })
        .join(', ') ?? ''
    )
  }
}
