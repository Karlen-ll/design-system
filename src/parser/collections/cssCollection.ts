import { StyleToken } from '@/parser/types'
import { Token } from '@/parser/tokens'

export type MediaRecord = (Token & StyleToken)[]
export type TokenTypeRecord = Record<number, MediaRecord>
export type ThemeRecord = Record<string, TokenTypeRecord>
export type Themes = Record<string, ThemeRecord>

export default class CssCollection {
  public themes: Themes = {}

  public addToken(token: Token & StyleToken) {
    // Create ThemeRecord
    if (!this.themes[token.themeName]) {
      this.themes[token.themeName] = {}
    }

    // Create TokenTypeRecord
    if (!this.themes[token.themeName][token.type]) {
      this.themes[token.themeName][token.type] = {}
    }

    // Create MediaRecord
    if (!this.themes[token.themeName][token.type][token.media]) {
      this.themes[token.themeName][token.type][token.media] = []
    }

    this.themes[token.themeName][token.type][token.media].push(token)
  }
}
