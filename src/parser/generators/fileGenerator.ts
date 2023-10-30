import fs, { PathLike } from 'fs'
import prettier, { BuiltInParserName } from 'prettier'
import { FileComment } from '@/parser/types'

export interface FileGeneratorOptions {
  outputPath: PathLike
}

export type SaveFileOptions = { comment?: FileComment; format?: BuiltInParserName }

export default abstract class FileGenerator {
  protected outputPath: PathLike

  private formatOptions = JSON.parse(fs.readFileSync('.prettierrc', 'utf-8'))

  protected constructor(options: FileGeneratorOptions) {
    this.outputPath = options.outputPath
  }

  protected clearDirectory() {
    const resultPath = `${this.outputPath}`

    fs.rmSync(resultPath, { recursive: true, force: true })
    fs.mkdirSync(resultPath)
  }

  /*#region SaveFile*/
  protected async saveFile(dir: PathLike, data: string, { comment, format = 'scss' }: SaveFileOptions = {}) {
    const context = comment ? this.prepareComment(comment) + data : data

    fs.writeFileSync(dir, format ? await this.formatFileData(context, format) : context)
  }

  private prepareComment(comment: FileComment) {
    return `/** ${Array.isArray(comment) ? comment.join('\n * ') : comment} */\n\n`
  }

  private async formatFileData(context: string, parser?: BuiltInParserName) {
    return prettier.format(context, { ...this.formatOptions, parser })
  }
  /*#endregion SaveFile*/

  public abstract generate(...args: unknown[]): Promise<void>
}
