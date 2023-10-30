import { genImport } from '@/utils/generator'
import { getCurrentDate } from '@/parser/utils/comment'
import FileGenerator, { FileGeneratorOptions } from './fileGenerator'
import { CssCollection } from '@/parser/collections'

export default class MdxGenerator extends FileGenerator {
  constructor(options: FileGeneratorOptions) {
    super(options)
  }

  async generate(collection: CssCollection) {
    const { themes } = collection

    this.clearDirectory()

    await Promise.all(
      Object.keys(themes).map((themeName) => this.saveThemeStringToFile(themeName, this.getThemeString(themeName)))
    )
  }

  private async saveThemeStringToFile(themeName: string, themeString: string) {
    await this.saveFile(`${this.outputPath}/${themeName}.mdx`, themeString, { format: 'mdx' })
  }

  private getThemeString(themeName: string) {
    return [
      genImport('@storybook/blocks', ['Meta']),
      genImport(`../json/${themeName}.json`, 'theme'),
      genImport('../../support/storybook/components/tokenDocs', 'TokenDocs'),
      '',
      `<Meta title="Design system/Tokens 🗂️/Thema «${themeName}»" />\n`,
      `<TokenDocs theme="${themeName}" token={theme.token} date="${getCurrentDate()}" />`,
    ].join('\n')
  }
}
