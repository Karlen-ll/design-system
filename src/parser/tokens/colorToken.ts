import { Paint, NodeTypes } from 'figma-api/lib/ast-types'
import { StyleToken } from '@/parser/types'
import Token, { TokenOptions } from '@/parser/tokens/token'
import ColorConverter from '@/parser/converters/colorConverter'

type NodeTypesWithFills = {
  [K in keyof NodeTypes]: NodeTypes[K] extends { fills: Paint[] } ? K : never
}[keyof NodeTypes]

export default class ColorToken<NType extends NodeTypesWithFills> extends Token<NType> implements StyleToken {
  constructor(options: TokenOptions<NType>) {
    super(options)
  }

  public getStyleProperties() {
    return {
      color: this.node.fills[0].color
        ? ColorConverter.getStyleColorValue(this.node.fills[0].color, this.node.fills[0].opacity)
        : '',
    }
  }
}
