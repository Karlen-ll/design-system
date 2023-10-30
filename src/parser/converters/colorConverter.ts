import { Color } from 'figma-api/lib/ast-types'

export default class ColorConverter {
  /** Преобразование значений цвета к нормальному диапазону
   * @param value Цвет, где все значения в диапазоне от 0 до 1
   * @return Color Цвет, где все значения в диапазоне от 0 до 255 */
  public static convertColorValuesToNormalRange(value: Color) {
    return Object.entries(value).reduce((acc: Partial<Color>, [key, value]) => {
      acc[key as keyof Color] = Math.round(value * 255)
      return acc
    }, {} as Partial<Color>) as Color
  }

  /** Получение hex значения
   * @param value число от 0 до 255 */
  public static getHexValue(value: number) {
    const hex = value.toString(16)

    return hex.length == 1 ? '0' + hex : hex
  }

  /** Преобразование цвета в строку Hex */
  public static convertToHex(color: Color, opacity?: number) {
    let result = '#' + this.getHexValue(color.r) + this.getHexValue(color.g) + this.getHexValue(color.b)

    if (opacity) {
      result += this.getHexValue(Math.round(opacity * 255))
    } else if (color.a < 255) {
      result += this.getHexValue(color.a)
    }

    return result
  }

  public static getStyleColorValue(color: Color, opacity?: number) {
    return this.convertToHex(this.convertColorValuesToNormalRange(color), opacity)
  }
}
