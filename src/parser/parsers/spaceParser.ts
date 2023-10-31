import { Node } from 'figma-api/lib/ast-types'
import Parser, { ParserOptions } from './parser'
import SpaceToken from '../tokens/spaceToken'

type SpacesTokenNodeType = 'FRAME'

export default class SpaceParser extends Parser<SpacesTokenNodeType> {
  public tokenName: string = 'space'

  constructor(options: ParserOptions) {
    super(options)
  }

  protected isTokenNode(node: Node, groupNodes: Node[]): boolean {
    return groupNodes?.[0]?.name === this.tokenName && node.type === 'FRAME' && !this.isMediaNode(node)
  }

  protected createToken(node: Node<SpacesTokenNodeType>, groupNodes: Node[], allNodes: Node[], media: number) {
    return new SpaceToken({ node, groupNodes, allNodes, media, themeRegex: this.themeRegex })
  }
}
