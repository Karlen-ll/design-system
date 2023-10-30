import { Node } from 'figma-api/lib/ast-types'
import Parser, { ParserOptions } from './parser'
import RoundingToken from '../tokens/roundingToken'

type RoundingTokenNodeType = 'RECTANGLE'

export default class ColorParser extends Parser<RoundingTokenNodeType> {
  public tokenName: string = 'rounding'

  constructor(options: ParserOptions) {
    super(options)
  }

  protected isTokenNode(node: Node, groupNodes: Node[]): boolean {
    return groupNodes?.[0]?.name === this.tokenName && node.type === 'RECTANGLE'
  }

  protected createToken(node: Node<RoundingTokenNodeType>, groupNodes: Node[], allNodes: Node[], media: number) {
    return new RoundingToken({ node, groupNodes, allNodes, media, themeRegex: this.themeRegex })
  }
}
