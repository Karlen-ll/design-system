import FileGenerator, { FileGeneratorOptions } from '@/parser/generators/fileGenerator'
import FigmaLoader from '@/parser/figmaLoader'
import { IconCollection } from '@/parser/collections'
import { IconToken } from '@/parser/tokens'
import { pascalize, kebabize } from '@/utils/formatter'
import { getComment } from '@/parser/utils/comment'

export type IconGeneratorOptions = FileGeneratorOptions & { figmaLoader: FigmaLoader }

export default class IconGenerator extends FileGenerator {
  private readonly figmaLoader: FigmaLoader

  constructor(options: IconGeneratorOptions) {
    super(options)
    this.figmaLoader = options.figmaLoader
  }

  public async generate(collection: IconCollection) {
    const { icons } = collection
    const svgs = await this.getSvgsRecord(icons)

    this.clearDirectory()

    await Promise.all([
      ...Object.entries(svgs).map(([name, svg]) => this.createSvg(name, svg)),
      this.createIndex(icons),
      this.createStorybookIndex(icons),
      this.createConstants(icons),
    ])
  }

  private async createSvg(name: string, svg: string) {
    await this.saveFile(`${this.outputPath}/${name}.svg`, svg, { format: 'html' })
  }

  private async createIndex(tokens: IconToken[]) {
    const exports = tokens
      .map((token) => `export { default as ${pascalize(token.fullname)} } from './${token.fullname}.svg'`)
      .join('\n')

    await this.saveFile(`${this.outputPath}/index.ts`, exports, { format: 'typescript', comment: getComment() })
  }

  private async createStorybookIndex(tokens: IconToken[]) {
    const namesMap = tokens.map((token) => [
      token.fullname,
      pascalize(token.fullname),
      kebabize(token.fullname.replace(/_/g, '-')),
    ])

    const exports = [
      namesMap.map(([full, pascal]) => `import ${pascal} from './${full}.svg?url'`).join('\n'),
      '',
      'export const icons = {',
      namesMap.map(([_, pascal, kebab]) => `'${kebab}': ${pascal},`).join('\n'),
      '}',
    ].join('\n')

    await this.saveFile(`${this.outputPath}/storybook.ts`, exports, { format: 'typescript', comment: getComment() })
  }

  private async createConstants(tokens: IconToken[]) {
    const result =
      'export const icons = [\n' +
      tokens.map((token) => `'${kebabize(token.fullname.replace(/_/g, '-'))}',`).join('\n') +
      '] as const\n'

    await this.saveFile(`${this.outputPath}/constants.ts`, result, { format: 'typescript', comment: getComment() })
  }

  private async getSvgsRecord(tokens: IconToken[]) {
    const svgs: Record<string, string> = {}

    const links = await this.figmaLoader.getImages(tokens.map((token) => token.id))

    for await (const [id, link] of Object.entries(links)) {
      const response = await fetch(link)
      const blob = await response.blob()

      const name = tokens.find((token) => token.id === id)?.fullname
      if (name) {
        svgs[name] = (await blob.text()).replace(/(fill|stroke)="(?!none)([a-zA-z0-9#]+)"/gm, '$1="currentColor"')
      }
    }

    return svgs
  }
}
