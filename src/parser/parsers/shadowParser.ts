import { Node } from 'figma-api/lib/ast-types'
import Parser, { ParserOptions } from './parser'
import ShadowToken from '../tokens/shadowToken'

type ShadowTokenNodeType = 'RECTANGLE'

export default class TextParser extends Parser<ShadowTokenNodeType> {
  public tokenName: string = 'shadow'

  constructor(options: ParserOptions) {
    super(options)
  }

  protected isTokenNode(node: Node, groupNodes: Node[]): boolean {
    return groupNodes?.[0]?.name === this.tokenName && node.type === 'RECTANGLE'
  }

  protected createToken(node: Node<ShadowTokenNodeType>, groupNodes: Node[], allNodes: Node[], media: number) {
    return new ShadowToken({ node, groupNodes, allNodes, media, themeRegex: this.themeRegex })
  }
}
