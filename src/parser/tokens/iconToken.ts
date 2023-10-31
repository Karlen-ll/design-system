import Token, { TokenOptions } from '@/parser/tokens/token'

export default class IconToken<NType extends 'INSTANCE' = 'INSTANCE'> extends Token<NType> {
  public readonly id: string

  constructor(options: TokenOptions<NType>) {
    super(options)
    const name = options.node.name.replace(/\//g, '_')

    this.id = this.node.id

    if (options.media > 0) {
      this.postfix = options.media
    }

    this.prefix = '' // ← Remove prefix
    this.name = name
  }
}
