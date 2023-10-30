import { Node } from 'figma-api/lib/ast-types'
import Parser, { ParserOptions } from './parser'
import SpacesToken from '../tokens/spacesToken'

type SpacesTokenNodeType = 'FRAME'

export default class SpacesParser extends Parser<SpacesTokenNodeType> {
  public tokenName: string = 'spaces'

  constructor(options: ParserOptions) {
    super(options)
  }

  protected isTokenNode(node: Node, groupNodes: Node[]): boolean {
    return groupNodes?.[0]?.name === this.tokenName && node.type === 'FRAME' && !this.isMediaNode(node)
  }

  protected createToken(node: Node<SpacesTokenNodeType>, groupNodes: Node[], allNodes: Node[], media: number) {
    return new SpacesToken({ node, groupNodes, allNodes, media, themeRegex: this.themeRegex })
  }
}
