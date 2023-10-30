import { Node } from 'figma-api/lib/ast-types'

export const FIGMA_BASE_URL = 'https://api.figma.com'
export const FIGMA_API_VERSION = 'v1'

export type GetDocumentOptions = {
  fileKey: string
  figmaToken: string
  baseUrl?: string
  apiVersion?: string
}

/** Получить документ из figma */
export async function fetchFigmaDocument(options: GetDocumentOptions) {
  const normalizedOptions: Required<GetDocumentOptions> = {
    ...options,
    baseUrl: options.baseUrl ?? FIGMA_BASE_URL,
    apiVersion: options.apiVersion ?? FIGMA_API_VERSION,
  }

  const file = await fetch(
    `${normalizedOptions.baseUrl}/${normalizedOptions.apiVersion}/files/${normalizedOptions.fileKey}`,
    { headers: { 'X-Figma-Token': normalizedOptions.figmaToken } }
  )

  const jsonResponse = await file.json()

  return jsonResponse?.document as Node<'DOCUMENT'>
}
