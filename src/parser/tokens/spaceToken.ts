import { getPixelValue } from '@/parser/utils'
import { StyleToken } from '@/parser/types'
import Token, { TokenOptions } from '@/parser/tokens/token'

export default class SpaceToken<NType extends 'FRAME'> extends Token<NType> implements StyleToken {
  constructor(options: TokenOptions<NType>) {
    super(options)

    const digitName = options.node.name.match(/\d+/g)?.[0]

    if (digitName) {
      this.name = digitName
    }
  }

  public getStyleProperties() {
    return {
      '-': getPixelValue(this.node.paddingTop),
    }
  }
}
