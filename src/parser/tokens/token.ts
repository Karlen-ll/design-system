import { Node, NodeTypes } from 'figma-api/lib/ast-types'

export interface TokenOptions<NType extends keyof NodeTypes> {
  themeRegex: RegExp
  node: Node<NType>
  groupNodes: Node[]
  allNodes: Node[]
  media: number
  postfix?: string | number
}

export default abstract class Token<NType extends keyof NodeTypes = keyof NodeTypes> {
  /** Имя токена */
  public name: string

  /** Тип токена */
  public type: string

  /** Имя темы */
  public themeName: string

  /** Приставка на основе групп (вложенности) */
  public prefix: string

  /** Постфикс */
  public postfix?: string | number

  /** Значение ширины икрана */
  public media: number

  /** Список групп */
  public groups: string[]

  protected node: Node<NType>
  protected groupNodes: Node[]
  protected allNodes: Node[]

  protected constructor(options: TokenOptions<NType>) {
    this.node = options.node
    this.groupNodes = options.groupNodes
    this.allNodes = options.groupNodes

    this.name = options.node.name
    this.type = options.groupNodes[0].name
    this.themeName = options.allNodes[0].name.match(options.themeRegex)?.[0] ?? options.allNodes[0].name

    this.prefix = options.groupNodes.map((node) => node.name).join('-')
    this.postfix = options.postfix

    this.media = options.media
    this.groups = options.groupNodes.slice(1).map((node) => node.name)
  }

  get fullname() {
    const result: (string | number)[] = [this.name]

    if (this.prefix) {
      result.unshift(this.prefix)
    }

    if (this.postfix) {
      result.push(this.postfix)
    }

    return result.join('-')
  }
}
