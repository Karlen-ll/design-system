import { getPixelValue } from '@/parser/utils'
import { StyleProperties, StyleToken } from '@/parser/types'
import Token, { TokenOptions } from '@/parser/tokens/token'

export default class TextToken<NType extends 'TEXT'> extends Token<NType> implements StyleToken {
  constructor(options: TokenOptions<NType>) {
    super(options)
  }

  public getStyleProperties() {
    const properties: StyleProperties = {
      'font-size': getPixelValue(this.node.style.fontSize),
      'font-family': this.node.style.fontFamily.toLowerCase(),
      'font-weight': this.node.style.fontWeight,
    }

    if (this.node.style.lineHeightPercentFontSize) {
      properties['line-height'] = Math.round((this.node.style.lineHeightPercentFontSize / 100) * 100) / 100
    }

    if (this.node.style.letterSpacing) {
      properties['letter-spacing'] = getPixelValue(this.node.style.letterSpacing)
    }

    if (this.node.style.italic) {
      properties['font-style'] = 'italic'
    }

    return properties
  }
}
