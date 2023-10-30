export type ImportExportType = 'import' | 'export' | 'import type' | 'export type'
export function genEsmStatement(type: ImportExportType, from: string, modules?: ESMModule | ESMModule[]) {
  if (!modules) {
    if (type === 'export' || type === 'export type') {
      return `${type} ${from}`
    }

    return `${type} '${from}'`
  }

  const importsIsArray = Array.isArray(modules)

  const imports = (importsIsArray ? modules : [modules]).map((importItem) => {
    if (typeof importItem === 'string') {
      return { name: importItem }
    }

    return importItem
  })

  const importsString = imports
    .map((importItem) => (importItem.as ? `${importItem.name} as ${importItem.as}` : importItem.name))
    .join(', ')

  if (importsIsArray) {
    return `${type} { ${importsString} } from '${from}'`
  }

  return `${type} ${importsString} from '${from}'`
}

export type ESMModule = string | { name: string; as?: string }
export function genImport(from: string, imports?: ESMModule | ESMModule[]) {
  return genEsmStatement('import', from, imports)
}

export function genExport(from: string, exports?: ESMModule | ESMModule[]) {
  return genEsmStatement('export', from, exports)
}
