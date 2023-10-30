import { getComment } from '@/parser/utils/comment'
import { FileGenerator } from '@/parser/generators'
import { FileGeneratorOptions } from '@/parser/generators/fileGenerator'
import JsonCollection, { ThemeRecord } from '@/parser/collections/jsonCollection'
import { Token } from '@/parser/tokens'
import { StyleToken } from '@/parser/types'

export default class JsonGenerator extends FileGenerator {
  constructor(options: FileGeneratorOptions) {
    super(options)
  }

  async generate(collection: JsonCollection) {
    const { themes } = collection

    this.clearDirectory()

    await Promise.all(
      Object.keys(themes).map((themeName) => this.saveToFile(themeName, this.getThemeString(themes[themeName])))
    )
  }

  private async saveToFile(themeName: string, themeString: string) {
    await this.saveFile(`${this.outputPath}/${themeName}.json`, themeString, { format: 'json' })
  }

  private getThemeString(theme: ThemeRecord): string {
    const result: string[] = []

    result.push(
      Object.entries(theme)
        .map(([tokenType, tokens]) => {
          return [
            `"${tokenType}": {`,
            `"tokens": [${this.getTokensString(tokens)}],`,
            `"filters": [${this.getFiltersString(tokens)}]`,
            '}',
          ].join('\n')
        })
        .join(',\n')
    )

    const typesString = Object.keys(theme)
      .map((tokenType) => `"${tokenType}"`)
      .join(', ')

    result.unshift('{', `"comment": "${getComment()}",`, '"token": {')
    result.push(`, "types": [${typesString}]`, '},', '}')

    return result.join('\n')
  }

  private getTokensString(tokens: (Token & StyleToken)[]) {
    return tokens
      .map((token) => {
        const propertiesEntries = Object.entries(token.getStyleProperties())

        if (propertiesEntries.length === 1) {
          const [, propValue] = propertiesEntries[0]
          let result = `{ "name": "${token.fullname}", "value": "${propValue}"`

          if (token.groups.length) {
            result += `, "filters": ["${token.groups.join('-')}"] }`
          } else {
            result += ' }'
          }

          return result
        }

        return propertiesEntries
          .map(([propKey, propValue]) => {
            return `{ "name": "${token.fullname}-${propKey}", "value": "${propValue}", "filters": ["${token.fullname}"] }`
          })
          .join(',\n')
      })
      .join(',\n')
  }

  private getFiltersString(tokens: (Token & StyleToken)[]) {
    const filters = new Set<string>()

    tokens.forEach((token) => {
      const propertiesEntries = Object.entries(token.getStyleProperties())

      if (propertiesEntries.length === 1) {
        if (token.groups.length) {
          filters.add(token.groups.join('-'))
        }
      } else {
        filters.add(token.fullname)
      }
    })

    return Array.from(filters)
      .map((filter) => `"${filter}"`)
      .join(', ')
  }
}
