import { getPixelValue } from '@/parser/utils'
import { StyleToken } from '@/parser/types'
import Token, { TokenOptions } from '@/parser/tokens/token'

export default class RoundingToken<NType extends 'RECTANGLE'> extends Token<NType> implements StyleToken {
  constructor(options: TokenOptions<NType>) {
    super(options)
  }

  public getStyleProperties() {
    return { 'border-radius': getPixelValue(this.node.cornerRadius) }
  }
}
