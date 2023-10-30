import { isNodeType, Node, NodeTypes } from 'figma-api/lib/ast-types'
import { Producer } from '@/parser/producer'
import { Token } from '@/parser/tokens'

type TypesOfNodesWithChildren = {
  [K in keyof NodeTypes]: NodeTypes[K] extends { children: Node[] } ? K : never
}[keyof NodeTypes]

export interface ParserOptions {
  producer: Producer
  pageRegex: RegExp | string
  themeRegex: RegExp
}

/** Класс для создания токенов */
export default abstract class Parser<NType extends keyof NodeTypes> {
  protected readonly groupNodeTypes: TypesOfNodesWithChildren[] = ['FRAME', 'GROUP']

  public abstract tokenName: string

  private readonly themeNodes: Node<'CANVAS'>[]

  protected tokens: Token<NType>[] = []

  protected themeRegex: RegExp

  private readonly producer: Producer

  protected constructor(options: ParserOptions) {
    if (!options.producer.document) {
      throw new Error('Document is not defined')
    }

    const pageRegex = new RegExp(options.pageRegex)

    this.themeNodes = options.producer.document.children.filter(
      (node: Node): node is Node<'CANVAS'> => isNodeType(node, 'CANVAS') && pageRegex.test(node.name)
    )

    this.producer = options.producer
    this.themeRegex = options.themeRegex
  }

  public parse(): void {
    this.themeNodes.forEach((themeNode) => {
      const tokens = this.getListOfTokens(themeNode)

      tokens.forEach((token) => {
        this.producer.collect(token)
      })
    })
  }

  /** Метод создания токена */
  protected abstract createToken(node: Node, groupNodes: Node[], allNodes: Node[], media: number): Token<NType>

  /*#region Методы проверки нод*/
  /** Метод проверки ноды на ноду токена (искомую) */
  protected abstract isTokenNode(node: Node, groupNodes: Node[]): boolean

  /** Метод проверки ноды на ноду группы (промежуточную, но учавствующую в создании имени токена) */
  protected isGroupNode(node: Node): node is Node<TypesOfNodesWithChildren> {
    return this.groupNodeTypes.some((type) => isNodeType(node, type)) && isNaN(Number(node.name))
  }

  /** Метод проверки ноды на медиа ноду */
  protected isMediaNode(node: Node): node is Node<TypesOfNodesWithChildren> {
    return this.groupNodeTypes.some((type) => isNodeType(node, type)) && !isNaN(Number(node.name))
  }

  /** Метод проверки ноды на промежуточную */
  private isNodeWithChildren(node: Node): node is Node<TypesOfNodesWithChildren> {
    return 'children' in node
  }
  /*#endregion Методы проверки нод*/

  /** Получение списка Token из Node удовлетворяющих isTokenNode */
  private getListOfTokens(node: Node, groupNodes: Node[] = [], allNodes: Node[] = [], media = -1): Token<NType>[] {
    if (this.isTokenNode(node, groupNodes)) {
      return [this.createToken(node, groupNodes, allNodes, media)]
    }

    if (groupNodes[0] && groupNodes[0].name !== this.tokenName) {
      return []
    }

    if (this.isNodeWithChildren(node)) {
      const nextMedia = this.isMediaNode(node) ? Number(node.name) : media

      return node.children.reduce((acc, subNode) => {
        const nextGroupNodes = this.isGroupNode(node) ? [...groupNodes, node] : groupNodes

        return [...acc, ...this.getListOfTokens(subNode, nextGroupNodes, [...allNodes, node], nextMedia)]
      }, [] as Token<NType>[])
    }

    return []
  }
}
