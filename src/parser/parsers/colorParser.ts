import { Node } from 'figma-api/lib/ast-types'
import Parser, { ParserOptions } from './parser'
import ColorToken from '@/parser/tokens/colorToken'

type ColorTokenNodeType = 'RECTANGLE' | 'ELLIPSE'

export default class ColorParser extends Parser<ColorTokenNodeType> {
  public tokenName: string = 'color'

  constructor(options: ParserOptions) {
    super(options)
  }

  protected isTokenNode(node: Node, groupNodes: Node[]): boolean {
    return groupNodes?.[0]?.name === this.tokenName && ['RECTANGLE', 'ELLIPSE'].includes(node.type)
  }

  protected createToken(node: Node<ColorTokenNodeType>, groupNodes: Node[], allNodes: Node[], media: number) {
    return new ColorToken({ node, groupNodes, allNodes, media, themeRegex: this.themeRegex })
  }
}
