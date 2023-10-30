import { getComment } from '@/parser/utils/comment'
import { FileGenerator } from '@/parser/generators'
import { FileGeneratorOptions } from '@/parser/generators/fileGenerator'
import ScssCollection, { TokensRecord } from '@/parser/collections/scssCollection'

export default class ScssGenerator extends FileGenerator {
  constructor(options: FileGeneratorOptions) {
    super(options)
  }

  async generate(collection: ScssCollection) {
    const { tokensByType } = collection

    this.clearDirectory()

    await Promise.all([
      ...Object.entries(tokensByType).map(([tokenType, tokens]) => {
        return this.saveToFile(
          `_${tokenType}`,
          this.getScssVariableStrings(tokens) + '\n' + this.getScssVariableMapString(tokenType, tokens)
        )
      }),
      this.saveToFile('index', this.getIndexString(Object.keys(tokensByType))),
    ])
  }

  private async saveToFile(tokenType: string, tokenString: string) {
    await this.saveFile(`${this.outputPath}/${tokenType}.scss`, tokenString, { format: 'scss', comment: getComment() })
  }

  private getScssVariableStrings(tokens: TokensRecord[keyof TokensRecord]) {
    return tokens
      .map((token) => {
        const propKeys = Object.keys(token.getStyleProperties())

        if (propKeys.length === 1) {
          return `$${token.fullname}: var(--${token.fullname});`
        }

        if (propKeys.length > 1) {
          return propKeys
            .map((propKey) => `$${token.fullname}-${propKey}: var(--${token.fullname}-${propKey});`)
            .join('\n')
        }
      })
      .join('\n')
  }

  private getScssVariableMapString(tokenType: string, tokens: TokensRecord[keyof TokensRecord]) {
    const result = tokens.map((token) => {
      const propKeys = Object.keys(token.getStyleProperties())

      if (propKeys.length === 1) {
        return `${token.fullname}: $${token.fullname},`
      }

      if (propKeys.length > 1) {
        return [
          `${token.fullname}: (`,
          propKeys.map((propKey) => `${propKey}: $${token.fullname}-${propKey},`).join('\n'),
          '),',
        ].join('\n')
      }
    })

    result.unshift(`$${tokenType}: (`)
    result.push(');')

    return result.join('\n')
  }

  private getIndexString(tokenTypes: string[]) {
    return tokenTypes.map((tokenType) => `@forward '_${tokenType}';`).join('\n')
  }
}
