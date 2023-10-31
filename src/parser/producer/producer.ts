import fs, { PathLike } from 'fs'
import { Node } from 'figma-api/lib/ast-types'
import FigmaLoader from '@/parser/figmaLoader'
import { Token, ColorToken, TextToken, ShadowToken, RoundingToken, SpaceToken, IconToken } from '@/parser/tokens'
import { CssGenerator, ScssGenerator, JsonGenerator, MdxGenerator, IconGenerator } from '@/parser/generators'
import { CssCollection, ScssCollection, JsonCollection, IconCollection } from '@/parser/collections'

export interface ProducerOptions {
  outputPath: PathLike
  figmaLoader: FigmaLoader
}

/** Класс для создания выходных файлов */
export default class Producer {
  public document: Node<'DOCUMENT'> | null = null

  private readonly figmaLoader: FigmaLoader

  private cssCollection = new CssCollection()
  private scssCollection = new ScssCollection()
  private jsonCollection = new JsonCollection()
  private iconCollection = new IconCollection()

  private readonly outputPath: PathLike

  private readonly cssGenerator: CssGenerator
  private readonly scssGenerator: ScssGenerator
  private readonly jsonGenerator: JsonGenerator
  private readonly mdxGenerator: MdxGenerator
  private readonly iconGenerator: IconGenerator

  constructor(options: ProducerOptions) {
    const { outputPath } = options
    this.outputPath = options.outputPath
    this.figmaLoader = options.figmaLoader

    this.cssGenerator = new CssGenerator({ outputPath })
    this.scssGenerator = new ScssGenerator({ outputPath: outputPath + '/scss' })
    this.jsonGenerator = new JsonGenerator({ outputPath: outputPath + '/json' })
    this.mdxGenerator = new MdxGenerator({ outputPath: outputPath + '/mdx' })
    this.iconGenerator = new IconGenerator({ outputPath: outputPath + '/icons', figmaLoader: this.figmaLoader })
  }

  public static createAsync = async (options: ProducerOptions) => {
    const instance = new this(options)
    await instance.createDocument()

    return instance
  }

  public async createDocument() {
    this.document = await this.figmaLoader.getDocument()
  }

  public collect(token: Token<any>): void {
    if (
      token instanceof ColorToken ||
      token instanceof TextToken ||
      token instanceof ShadowToken ||
      token instanceof RoundingToken ||
      token instanceof SpaceToken
    ) {
      this.cssCollection.addToken(token)
      this.scssCollection.addToken(token)
      this.jsonCollection.addToken(token)
    } else if (token instanceof IconToken) {
      this.iconCollection.addToken(token)
    }
  }

  public async generate(): Promise<void> {
    this.clearDirectory()

    await Promise.all([
      this.cssGenerator.generate(this.cssCollection),
      this.scssGenerator.generate(this.scssCollection),
      this.jsonGenerator.generate(this.jsonCollection),
      this.mdxGenerator.generate(this.cssCollection),
      this.iconGenerator.generate(this.iconCollection),
    ])
  }

  private clearDirectory() {
    fs.rmSync(this.outputPath, { recursive: true, force: true })
    fs.mkdirSync(this.outputPath)
  }
}
