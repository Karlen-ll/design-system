import { capitalize } from '@/utils/formatter'
import { getComment } from '@/parser/utils/comment'
import { FileGeneratorOptions } from '@/parser/generators/fileGenerator'
import { FileGenerator } from '@/parser/generators'
import { StyleToken } from '@/parser/types'
import { Token } from '@/parser/tokens'
import CssCollection, { ThemeRecord, MediaRecord, TokenTypeRecord } from '@/parser/collections/cssCollection'

export default class CssGenerator extends FileGenerator {
  constructor(options: FileGeneratorOptions) {
    super(options)
  }

  public async generate(collection: CssCollection) {
    const { themes } = collection

    await Promise.all(
      Object.keys(themes).map((themeName) =>
        this.saveToFile(themeName, this.getThemeString(themeName, themes[themeName]))
      )
    )
  }

  private async saveToFile(themeName: string, themeString: string) {
    await this.saveFile(`${this.outputPath}/${themeName}.css`, themeString, { format: 'css', comment: getComment() })
  }

  /*#region getString*/
  private getThemeString(themeName: string, theme: ThemeRecord): string {
    const result = Object.entries(theme)
      .sort(([a], [b]) => Number(a) - Number(b))
      .reduce((acc, [tokenType, tokenTypeRecord]) => {
        acc.push(this.getTokenTypeString(tokenType, tokenTypeRecord))

        return acc
      }, [] as string[])

    result.unshift(themeName === 'default' ? ':root {' : `.${themeName} {`)
    result.push('}')

    return result.join('\n')
  }

  private getTokenTypeString(tokenType: string, tokenTypeRecord: TokenTypeRecord) {
    const mediaEntries = Object.entries(tokenTypeRecord)
    const minMedia = Math.min(...mediaEntries.map(([mediaKey]) => Number(mediaKey)))
    return (
      `/* ${capitalize(tokenType)} */\n` +
      mediaEntries
        .map(([mediaKey, media]) => this.getMediaString(Number(mediaKey), media, Number(mediaKey) > minMedia))
        .join('\n') +
      '\n'
    )
  }

  private getMediaString(mediaValue: number, media: MediaRecord, needWrap: boolean = true): string {
    const result: string[] = []

    if (needWrap) {
      result.push(`@media screen and (min-width: ${mediaValue}px) {`)
    }

    Object.entries(media).forEach(([, value]) => {
      result.push(this.getPropertiesString(value))
    })

    if (needWrap) {
      result.push('}')
    }

    return `${result.join('\n')}\n`
  }

  private getPropertiesString(token: Token & StyleToken): string {
    const propertiesEntries = Object.entries(token.getStyleProperties())

    if (propertiesEntries.length === 1) {
      const [, propValue] = propertiesEntries[0]

      return `--${token.fullname}: ${propValue};`
    }

    return (
      propertiesEntries.map(([propKey, propValue]) => `--${token.fullname}-${propKey}: ${propValue};`).join('\n') + '\n'
    )
  }
  /*#endregion getString*/
}
