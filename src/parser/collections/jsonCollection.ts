import { StyleToken } from '@/parser/types'
import { Token } from '@/parser/tokens'

export type ThemeRecord = Record<string, (Token & StyleToken)[]>
export type Themes = Record<string, ThemeRecord>

export default class JsonCollection {
  public themes: Themes = {}
  public count: number = 0

  public addToken(token: Token & StyleToken) {
    // Создать ThemeRecord если нет
    if (!this.themes[token.themeName]) {
      this.themes[token.themeName] = {}
    }

    // Создать GroupRecord если нет
    if (!this.themes[token.themeName][token.type]) {
      this.themes[token.themeName][token.type] = []
    }

    if (!~this.themes[token.themeName][token.type].findIndex((t) => t.fullname === token.fullname)) {
      this.themes[token.themeName][token.type].push(token)
      this.count++
    }
  }
}
