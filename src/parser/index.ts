import { NodeTypes } from 'figma-api/lib/ast-types'
import { Producer } from '@/parser/producer'
import { ColorParser, RoundingParser, ShadowParser, SpaceParser, TextParser, IconParser } from '@/parser/parsers'
import Parser, { ParserOptions } from '@/parser/parsers/parser'
import FigmaLoader from '@/parser/figmaLoader'

/** Получить токены */
export async function extractTokensFromFigma() {
  if (!process.env.FIGMA_TOKEN) {
    console.error('Not found FIGMA_TOKEN')
    process.exit(1)
  }

  if (!process.env.FIGMA_FILE_ID) {
    console.error('Not found FIGMA_FILE_ID')
    process.exit(1)
  }

  const figmaLoader = new FigmaLoader({
    figmaToken: process.env.FIGMA_TOKEN,
    fileKey: process.env.FIGMA_FILE_ID,
  })

  const producer = await Producer.createAsync({
    outputPath: 'dist',
    figmaLoader,
  })

  const parserOptions: ParserOptions = {
    producer,
    pageRegex: 'tokens-*',
    themeRegex: /\w+$/,
  }

  const parsers: Parser<keyof NodeTypes>[] = [
    new ColorParser(parserOptions),
    new TextParser(parserOptions),
    new ShadowParser(parserOptions),
    new RoundingParser(parserOptions),
    new SpaceParser(parserOptions),
    new IconParser(parserOptions),
  ]

  parsers.forEach((parser) => {
    parser.parse()
  })

  await producer.generate()
}
