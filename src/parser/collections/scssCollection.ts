import { Token } from '@/parser/tokens'
import { StyleToken } from '@/parser/types'

export type TokensRecord = Record<string, (Token & StyleToken)[]>

const DEFAULT_THEME = 'default'

export default class ScssCollection {
  public tokensByType: TokensRecord = {}

  public addToken(token: Token & StyleToken) {
    if (token.themeName === DEFAULT_THEME) {
      if (!this.tokensByType[token.type]) {
        this.tokensByType[token.type] = []
      }

      if (!~this.tokensByType[token.type].findIndex((t) => t.fullname === token.fullname))
        this.tokensByType[token.type].push(token)
    }
  }
}
