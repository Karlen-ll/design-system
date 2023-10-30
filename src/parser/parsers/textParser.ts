import { Node } from 'figma-api/lib/ast-types'
import Parser, { ParserOptions } from './parser'
import TextToken from '../tokens/textToken'

type TextTokenNodeType = 'TEXT'

export default class TextParser extends Parser<TextTokenNodeType> {
  public tokenName: string = 'text'

  constructor(options: ParserOptions) {
    super(options)
  }

  protected isTokenNode(node: Node, groupNodes: Node[]): boolean {
    return groupNodes?.[0]?.name === this.tokenName && node.type === 'TEXT'
  }

  protected createToken(node: Node<TextTokenNodeType>, groupNodes: Node[], allNodes: Node[], media: number) {
    return new TextToken({ node, groupNodes, allNodes, media, themeRegex: this.themeRegex })
  }
}
