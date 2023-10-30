import { Node } from 'figma-api/lib/ast-types'
import Parser, { ParserOptions } from './parser'
import { IconToken } from '@/parser/tokens'

// getImageApi

type IconTokenNodeType = 'INSTANCE'

export default class IconParser extends Parser<IconTokenNodeType> {
  public tokenName: string = 'icons'

  constructor(options: ParserOptions) {
    super(options)
  }

  protected isTokenNode(node: Node, groupNodes: Node[]): boolean {
    return groupNodes?.[0]?.name === this.tokenName && node.type === 'INSTANCE'
  }

  protected createToken(node: Node<IconTokenNodeType>, groupNodes: Node[], allNodes: Node[], media: number) {
    return new IconToken({ node, groupNodes, allNodes, media, themeRegex: this.themeRegex })
  }
}
