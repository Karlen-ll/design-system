export type ValueComparer = (a: any, b: any) => boolean

export const simpleComparer: ValueComparer = (a, b) => a === b
