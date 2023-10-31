import { Node } from 'figma-api/lib/ast-types'

export const FIGMA_BASE_URL = 'https://api.figma.com'
export const FIGMA_API_VERSION = 'v1'

export interface FigmaLoaderOptions {
  fileKey: string
  figmaToken: string
  baseUrl?: string
  apiVersion?: string
}

export default class FigmaLoader {
  private readonly fileKey: string
  private readonly figmaToken: string
  private readonly baseUrl: string
  private readonly apiVersion: string

  constructor(options: FigmaLoaderOptions) {
    this.fileKey = options.fileKey
    this.figmaToken = options.figmaToken
    this.baseUrl = options.baseUrl ?? FIGMA_BASE_URL
    this.apiVersion = options.apiVersion ?? FIGMA_API_VERSION
  }

  public async getDocument() {
    const url = `${this.baseUrl}/${this.apiVersion}/files/${this.fileKey}`
    const init = { headers: { 'X-Figma-Token': this.figmaToken } }

    const response = (await (await fetch(url, init)).json()) as any
    const document = response?.document as Node<'DOCUMENT'>

    if (!document) {
      throw new Error('Не удалось загрузить документ!')
    }

    return document
  }

  public async getImages(ids: string[], format: 'jpg' | 'png' | 'svg' | 'pdf' = 'svg') {
    const query = { ids: ids.join(','), format }
    const queryUrl = Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    const url = `${this.baseUrl}/${this.apiVersion}/images/${this.fileKey}?${queryUrl}`
    const init = { headers: { 'X-Figma-Token': this.figmaToken } }

    const response = (await (await fetch(url, init)).json()) as any
    const links = response?.images

    if (!links) {
      throw new Error('Не удалось загрузить ссылки на изображения!')
    }

    return links as Record<string, string>
  }
}
